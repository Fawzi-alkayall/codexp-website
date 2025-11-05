import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  AuthService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  static const String _baseUrl = 'https://40-172-163-101.sslip.io';
  static const String _loginPath = '/api/auth/login';
  static const String _tokenKey = 'auth_token';
  static const String _emailKey = 'saved_email';
  static const String _rememberMeKey = 'remember_me';

  /// Login and optionally save credentials
  Future<String> login({
    required String email,
    required String password,
    bool rememberMe = false,
  }) async {
    final uri = Uri.parse('$_baseUrl$_loginPath');
    try {
      final resp = await _client
          .post(
            uri,
            headers: const {
              HttpHeaders.contentTypeHeader: 'application/json',
              HttpHeaders.acceptHeader: 'application/json',
            },
            body: jsonEncode({
              'email': email,
              'password': password,
            }),
          )
          .timeout(const Duration(seconds: 15));

      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        final body = jsonDecode(resp.body);
        // Extract session token from various possible response shapes
        final token =
            body['session'] ??
            body['successResult']?['session'] ??
            body['data']?['session'] ??
            body['token'] ??
            body['access_token'] ??
            body['data']?['token'];
        if (token is String && token.isNotEmpty) {
          // Save token and remember me preference
          await _saveAuthData(token, email, rememberMe);
          return token;
        }
        // If no token, return the whole body as string for debugging
        return resp.body;
      } else {
        String message = 'Login failed (HTTP ${resp.statusCode})';
        try {
          final err = jsonDecode(resp.body);
          message = err['message'] ?? err['error'] ?? message;
        } catch (_) {}
        throw AuthException(message);
      }
    } on SocketException {
      throw AuthException('Network error. Check your internet connection.');
    } on HttpException catch (e) {
      throw AuthException('HTTP error: ${e.message}');
    } on FormatException {
      throw AuthException('Invalid server response.');
    } on AuthException {
      rethrow;
    } on Exception catch (e) {
      throw AuthException('Unexpected error: $e');
    }
  }

  /// Save auth data to local storage
  Future<void> _saveAuthData(String token, String email, bool rememberMe) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setBool(_rememberMeKey, rememberMe);
    if (rememberMe) {
      await prefs.setString(_emailKey, email);
    } else {
      await prefs.remove(_emailKey);
    }
  }

  /// Get saved token
  Future<String?> getSavedToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  /// Get saved email if remember me was enabled
  Future<String?> getSavedEmail() async {
    final prefs = await SharedPreferences.getInstance();
    final rememberMe = prefs.getBool(_rememberMeKey) ?? false;
    if (rememberMe) {
      return prefs.getString(_emailKey);
    }
    return null;
  }

  /// Check if remember me is enabled
  Future<bool> isRememberMeEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_rememberMeKey) ?? false;
  }

  /// Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await getSavedToken();
    return token != null && token.isNotEmpty;
  }

  /// Logout and clear saved data
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_emailKey);
    await prefs.remove(_rememberMeKey);
  }
}

class AuthException implements Exception {
  AuthException(this.message);
  final String message;
  @override
  String toString() => 'AuthException: $message';
}

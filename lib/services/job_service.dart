import 'dart:convert';
import 'package:flutter/foundation.dart';

import 'package:http/http.dart' as http;
import 'auth_service.dart';

class JobService {
  JobService({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;
  final _auth = AuthService();

  static const String _baseUrl = 'https://40-172-163-101.sslip.io';

  Future<Map<String, String>> _getHeaders() async {
    final token = await _auth.getSavedToken();
    return {
       'Content-Type': 'application/json',
       'Accept': 'application/json',
       if (token != null) 'Authorization': token,
    };
  }

  Future<List<dynamic>> fetchGroups({int page = 1, int limit = 9}) async {
    final uri = Uri.parse('$_baseUrl/api/groups?page=$page&limit=$limit');
    final headers = await _getHeaders();
    
     try {
       debugPrint('Fetching groups with headers: $headers');
       final resp = await _client.get(uri, headers: headers).timeout(const Duration(seconds: 15));
      debugPrint('Groups API response: ${resp.statusCode}');
      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        final data = jsonDecode(resp.body);
        final items = (data['successResult']?['items']) ?? data['items'] ?? data['data'] ?? data['groups'] ?? [];
        return (items is List) ? items : [];
       }
     
       throw Exception('Failed to fetch groups: ${resp.statusCode} - ${resp.body}');
     } catch (e) {
       debugPrint('Error fetching groups: $e');
       throw Exception('Failed to fetch groups: $e');
    }
  }

  Future<List<dynamic>> fetchLegalEntities({required int groupId}) async {
    final uri = Uri.parse('$_baseUrl/api/legal_entities?group=$groupId');
    final headers = await _getHeaders();
    
    try {
      debugPrint('Fetching legal entities for group $groupId');
      final resp = await _client.get(uri, headers: headers).timeout(const Duration(seconds: 15));
      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        final data = jsonDecode(resp.body);
        final items = (data['successResult']?['items']) ?? data['items'] ?? data['data'] ?? data['legal_entities'] ?? [];
        return (items is List) ? items : [];
      }
      throw Exception('Failed to fetch legal entities: ${resp.statusCode}');
    } catch (e) {
      debugPrint('Error fetching legal entities: $e');
      throw Exception('Failed to fetch legal entities: $e');
    }
  }

  Future<List<dynamic>> fetchBrands() async {
    final uri = Uri.parse('$_baseUrl/api/brands');
    final headers = await _getHeaders();
    
    try {
      final resp = await _client.get(uri, headers: headers).timeout(const Duration(seconds: 15));
      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        final data = jsonDecode(resp.body);
        final items = (data['successResult']?['items']) ?? data['items'] ?? data['data'] ?? data['brands'] ?? [];
        return (items is List) ? items : [];
      }
      throw Exception('Failed to fetch brands: ${resp.statusCode}');
    } catch (e) {
      debugPrint('Error fetching brands: $e');
      throw Exception('Failed to fetch brands: $e');
    }
  }

  Future<List<dynamic>> fetchCountries() async {
    final uri = Uri.parse('$_baseUrl/api/countries');
    final headers = await _getHeaders();
    
    try {
      final resp = await _client.get(uri, headers: headers).timeout(const Duration(seconds: 15));
      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        final data = jsonDecode(resp.body);
        final items = (data['successResult']?['items']) ?? data['items'] ?? data['data'] ?? data['countries'] ?? [];
        return (items is List) ? items : [];
      }
      throw Exception('Failed to fetch countries: ${resp.statusCode}');
    } catch (e) {
      debugPrint('Error fetching countries: $e');
      throw Exception('Failed to fetch countries: $e');
    }
  }

  Future<List<dynamic>> fetchItems() async {
    final uri = Uri.parse('$_baseUrl/api/items');
    final headers = await _getHeaders();
    
    try {
      final resp = await _client.get(uri, headers: headers).timeout(const Duration(seconds: 15));
      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        final data = jsonDecode(resp.body);
        final items = (data['successResult']?['items']) ?? data['items'] ?? data['data'] ?? [];
        return (items is List) ? items : [];
      }
      throw Exception('Failed to fetch items: ${resp.statusCode}');
    } catch (e) {
      debugPrint('Error fetching items: $e');
      throw Exception('Failed to fetch items: $e');
    }
  }

  Future<List<dynamic>> fetchLocations() async {
    final uri = Uri.parse('$_baseUrl/api/locations');
    final headers = await _getHeaders();
    
    try {
      final resp = await _client.get(uri, headers: headers).timeout(const Duration(seconds: 15));
      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        final data = jsonDecode(resp.body);
        final items = (data['successResult']?['items']) ?? data['items'] ?? data['data'] ?? data['locations'] ?? [];
        return (items is List) ? items : [];
      }
      throw Exception('Failed to fetch locations: ${resp.statusCode}');
    } catch (e) {
      debugPrint('Error fetching locations: $e');
      throw Exception('Failed to fetch locations: $e');
    }
  }

  Future<Map<String, dynamic>> createJob(Map<String, dynamic> jobData) async {
    final uri = Uri.parse('$_baseUrl/api/jobs');
    final headers = await _getHeaders();
    
     try {
       debugPrint('Creating job with data: $jobData');
       final resp = await _client
           .post(uri, headers: headers, body: jsonEncode(jobData))
           .timeout(const Duration(seconds: 15));
     
       debugPrint('Create job response: ${resp.statusCode} - ${resp.body}');
     
       if (resp.statusCode >= 200 && resp.statusCode < 300) {
         return jsonDecode(resp.body);
       }
     
       String message = 'Failed to create job (HTTP ${resp.statusCode})';
       try {
         final err = jsonDecode(resp.body);
         message = err['message'] ?? err['error'] ?? message;
       } catch (_) {}
       throw Exception(message);
     } catch (e) {
       debugPrint('Error creating job: $e');
       rethrow;
     }
  }

  Future<Map<String, dynamic>> fetchJobs({int page = 1, int limit = 10}) async {
    final uri = Uri.parse('$_baseUrl/api/jobs?page=$page&limit=$limit');
    final headers = await _getHeaders();
    
    try {
      debugPrint('Fetching jobs: page=$page, limit=$limit');
      final resp = await _client.get(uri, headers: headers).timeout(const Duration(seconds: 15));
      
      debugPrint('Jobs API response: ${resp.statusCode}');
      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        final data = jsonDecode(resp.body);
        return {
          'items': (data['successResult']?['items']) ?? data['items'] ?? data['data'] ?? data['jobs'] ?? [],
          'total': data['successResult']?['total'] ?? data['total'] ?? 0,
          'page': page,
          'limit': limit,
        };
      }
      throw Exception('Failed to fetch jobs: ${resp.statusCode}');
    } catch (e) {
      debugPrint('Error fetching jobs: $e');
      throw Exception('Failed to fetch jobs: $e');
    }
  }
}

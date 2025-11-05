import 'dart:ui';

import 'package:flutter/material.dart';

/// A reusable glassmorphism container with backdrop blur, subtle gradient,
/// translucent border, and soft shadow.
class GlassContainer extends StatelessWidget {
  const GlassContainer({
    super.key,
    this.child,
    this.padding,
    this.margin,
    this.borderRadius = const BorderRadius.all(Radius.circular(20)),
    this.blur = 20,
    this.opacity = 0.15,
    this.borderOpacity = 0.25,
  });

  final Widget? child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadius borderRadius;
  final double blur;
  final double opacity;
  final double borderOpacity;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final baseColor = theme.colorScheme.surface;
    return Padding(
      padding: margin ?? EdgeInsets.zero,
      child: ClipRRect(
        borderRadius: borderRadius,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              borderRadius: borderRadius,
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  baseColor.withValues(alpha: opacity + 0.05),
                  baseColor.withValues(alpha: opacity),
                ],
              ),
              border: Border.all(
                color: Colors.white.withValues(alpha: borderOpacity),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.10),
                  blurRadius: 20,
                  spreadRadius: 2,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}

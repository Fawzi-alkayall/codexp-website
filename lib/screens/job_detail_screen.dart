import 'package:flutter/material.dart';
import '../widgets/glass.dart';

class JobDetailScreen extends StatelessWidget {
  final dynamic job;
  final int sequence;

  const JobDetailScreen({
    super.key,
    required this.job,
    required this.sequence,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/rpe_login.jpg'),
            fit: BoxFit.cover,
          ),
        ),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.black.withValues(alpha: 0.6),
                Colors.black.withValues(alpha: 0.8),
              ],
            ),
          ),
          child: SafeArea(
            child: Column(
              children: [
                _buildHeader(context),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _buildSequenceCard(),
                        const SizedBox(height: 16),
                        _buildBasicInfo(),
                        const SizedBox(height: 16),
                        _buildDeliveryInfo(),
                        const SizedBox(height: 16),
                        _buildItemsInfo(),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
          const SizedBox(width: 8),
          const Icon(Icons.description_outlined, color: Color(0xFFFF8C42), size: 28),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Job Details',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Complete information',
                  style: TextStyle(
                    color: Color(0xFFB0B0B0),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSequenceCard() {
    final status = job['status']?.toString() ?? 'pending';
    
    return GlassContainer(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: const Color(0xFFFF8C42).withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Center(
              child: Text(
                '#$sequence',
                style: const TextStyle(
                  color: Color(0xFFFF8C42),
                  fontWeight: FontWeight.bold,
                  fontSize: 32,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            job['name']?.toString() ?? 'Untitled Job',
            style: const TextStyle(
              color: Color(0xFFE0E0E0),
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: _getStatusColor(status).withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _getStatusIcon(status),
                  size: 16,
                  color: _getStatusColor(status),
                ),
                const SizedBox(width: 6),
                Text(
                  status.toUpperCase(),
                  style: TextStyle(
                    color: _getStatusColor(status),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBasicInfo() {
    return GlassContainer(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader(Icons.info_outline, 'Basic Information'),
          const SizedBox(height: 16),
          _buildDetailRow('Group', job['group']?.toString() ?? 'N/A'),
          _buildDetailRow('Legal Entity', job['legalEntity']?.toString() ?? 'N/A'),
          _buildDetailRow('Country', job['country']?.toString() ?? 'N/A'),
          if (job['brands'] != null && job['brands'] is List && (job['brands'] as List).isNotEmpty)
            _buildDetailRow('Brands', (job['brands'] as List).join(', ')),
        ],
      ),
    );
  }

  Widget _buildDeliveryInfo() {
    final deliveryDate = job['deliveryDate']?.toString() ?? job['delivery_date']?.toString() ?? '';
    String formattedDate = deliveryDate;
    if (deliveryDate.isNotEmpty) {
      try {
        final date = DateTime.parse(deliveryDate);
        formattedDate = '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
      } catch (_) {}
    }

    return GlassContainer(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader(Icons.local_shipping_outlined, 'Delivery Information'),
          const SizedBox(height: 16),
          _buildDetailRow('Delivery Date', formattedDate.isNotEmpty ? formattedDate : 'N/A'),
          _buildDetailRow('Method', job['method']?.toString() ?? 'N/A'),
          if (job['email'] != null) _buildDetailRow('Email', job['email'].toString()),
          if (job['url'] != null) _buildDetailRow('URL', job['url'].toString()),
        ],
      ),
    );
  }

  Widget _buildItemsInfo() {
    final items = job['items'];
    
    if (items == null || (items is List && items.isEmpty)) {
      return GlassContainer(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildSectionHeader(Icons.inventory_2_outlined, 'Related Items'),
            const SizedBox(height: 16),
            const Text(
              'No items',
              style: TextStyle(
                color: Color(0xFFB0B0B0),
                fontSize: 14,
              ),
            ),
          ],
        ),
      );
    }

    return GlassContainer(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader(Icons.inventory_2_outlined, 'Related Items'),
          const SizedBox(height: 16),
          ...(items as List).map((item) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: const Color(0xFFFF8C42).withValues(alpha: 0.3),
                    width: 1,
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.inventory_2, color: Color(0xFFFF8C42), size: 20),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Item: ${item['item']?.toString() ?? item['itemId']?.toString() ?? 'N/A'}',
                            style: const TextStyle(
                              color: Color(0xFFE0E0E0),
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Qty: ${item['quantity']?.toString() ?? '0'} • Location: ${item['location']?.toString() ?? item['locationId']?.toString() ?? 'N/A'}',
                            style: const TextStyle(
                              color: Color(0xFFB0B0B0),
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(IconData icon, String title) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFFFF8C42).withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: const Color(0xFFFF8C42), size: 20),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(
            color: Color(0xFFE0E0E0),
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                color: Color(0xFFB0B0B0),
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                color: Color(0xFFE0E0E0),
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  IconData _getStatusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return Icons.check_circle;
      case 'pending':
        return Icons.pending;
      case 'in_progress':
      case 'in progress':
        return Icons.loop;
      case 'cancelled':
        return Icons.cancel;
      default:
        return Icons.info;
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return Colors.greenAccent;
      case 'pending':
        return Colors.orangeAccent;
      case 'in_progress':
      case 'in progress':
        return Colors.blueAccent;
      case 'cancelled':
        return Colors.redAccent;
      default:
        return const Color(0xFFB0B0B0);
    }
  }
}

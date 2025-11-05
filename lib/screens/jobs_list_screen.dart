import 'package:flutter/material.dart';
import '../services/job_service.dart';
import '../widgets/glass.dart';
import 'job_detail_screen.dart';

class JobsListScreen extends StatefulWidget {
  const JobsListScreen({super.key});

  @override
  State<JobsListScreen> createState() => _JobsListScreenState();
}

class _JobsListScreenState extends State<JobsListScreen> {
  final _jobService = JobService();
  List<dynamic> _jobs = [];
  bool _isLoading = false;
  int _currentPage = 1;
  int _totalJobs = 0;
  final int _itemsPerPage = 10;

  @override
  void initState() {
    super.initState();
    _loadJobs();
  }

  Future<void> _loadJobs() async {
    setState(() => _isLoading = true);
    try {
      final result = await _jobService.fetchJobs(page: _currentPage, limit: _itemsPerPage);
      setState(() {
        _jobs = result['items'] ?? [];
        _totalJobs = result['total'] ?? 0;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading jobs: $e')),
        );
      }
    }
  }

  void _nextPage() {
    if (_currentPage * _itemsPerPage < _totalJobs) {
      setState(() => _currentPage++);
      _loadJobs();
    }
  }

  void _previousPage() {
    if (_currentPage > 1) {
      setState(() => _currentPage--);
      _loadJobs();
    }
  }

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
                _buildHeader(),
                Expanded(
                  child: _isLoading
                      ? const Center(
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFF8C42)),
                          ),
                        )
                      : _jobs.isEmpty
                          ? Center(
                              child: GlassContainer(
                                padding: const EdgeInsets.all(24),
                                margin: const EdgeInsets.all(16),
                                child: const Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.work_off_outlined,
                                      size: 64,
                                      color: Color(0xFFB0B0B0),
                                    ),
                                    SizedBox(height: 16),
                                    Text(
                                      'No jobs found',
                                      style: TextStyle(
                                        color: Color(0xFFE0E0E0),
                                        fontSize: 18,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _jobs.length,
                              itemBuilder: (context, index) {
                                final job = _jobs[index];
                                return _buildJobCard(job, index + (_currentPage - 1) * _itemsPerPage + 1);
                              },
                            ),
                ),
                if (!_isLoading && _jobs.isNotEmpty) _buildPagination(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
          const SizedBox(width: 8),
          const Icon(Icons.work_outline, color: Color(0xFFFF8C42), size: 28),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'All Jobs',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Tap to view details',
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

  Widget _buildJobCard(dynamic job, int sequence) {
    final jobName = job['name']?.toString() ?? 'Untitled Job';
    final createdAt = job['createdAt']?.toString() ?? job['created_at']?.toString() ?? '';
    final status = job['status']?.toString() ?? 'pending';
    
    // Format date if available
    String formattedDate = '';
    if (createdAt.isNotEmpty) {
      try {
        final date = DateTime.parse(createdAt);
        formattedDate = '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
      } catch (_) {
        formattedDate = createdAt;
      }
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassContainer(
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(20),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => JobDetailScreen(job: job, sequence: sequence),
                ),
              );
            },
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFF8C42).withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Text(
                        '#$sequence',
                        style: const TextStyle(
                          color: Color(0xFFFF8C42),
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          jobName,
                          style: const TextStyle(
                            color: Color(0xFFE0E0E0),
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(
                              _getStatusIcon(status),
                              size: 14,
                              color: _getStatusColor(status),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              status.toUpperCase(),
                              style: TextStyle(
                                color: _getStatusColor(status),
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            if (formattedDate.isNotEmpty) ...[
                              const SizedBox(width: 12),
                              const Icon(Icons.calendar_today, size: 12, color: Color(0xFFB0B0B0)),
                              const SizedBox(width: 4),
                              Text(
                                formattedDate,
                                style: const TextStyle(
                                  color: Color(0xFFB0B0B0),
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.arrow_forward_ios,
                    color: Color(0xFFFF8C42),
                    size: 16,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPagination() {
    final totalPages = (_totalJobs / _itemsPerPage).ceil();
    
    return Padding(
      padding: const EdgeInsets.all(16),
      child: GlassContainer(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              icon: const Icon(Icons.arrow_back, color: Color(0xFFE0E0E0)),
              onPressed: _currentPage > 1 ? _previousPage : null,
            ),
            Text(
              'Page $_currentPage of $totalPages',
              style: const TextStyle(
                color: Color(0xFFE0E0E0),
                fontWeight: FontWeight.w600,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.arrow_forward, color: Color(0xFFE0E0E0)),
              onPressed: _currentPage < totalPages ? _nextPage : null,
            ),
          ],
        ),
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

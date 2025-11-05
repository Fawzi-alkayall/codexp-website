import 'package:flutter/material.dart';
import '../widgets/glass.dart';
import '../services/auth_service.dart';
import 'create_job_screen.dart';
import 'jobs_list_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  Future<void> _logout(BuildContext context) async {
    final auth = AuthService();
    await auth.logout();
    if (!context.mounted) return;
    Navigator.of(context).pushReplacementNamed('/');
  }

  void _navigateToCreateJob(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const CreateJobScreen()),
    );
    if (result == true && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Job created successfully!')),
      );
    }
  }

  void _navigateToJobsList(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const JobsListScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/rpe_login.jpg'),
            fit: BoxFit.cover,
            colorFilter: ColorFilter.mode(
              Colors.black54,
              BlendMode.darken,
            ),
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header
                GlassContainer(
                  borderRadius: BorderRadius.circular(24),
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 26,
                        backgroundColor: Colors.white.withValues(alpha: 0.15),
                        child: const Icon(Icons.person, color: Colors.white),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Welcome 👋',
                              style: TextStyle(
                                color: Color(0xFFFF8C42),
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Here\'s your overview for today',
                              style: TextStyle(
                                color: Color(0xFFE0E0E0),
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () {},
                        icon: const Icon(Icons.notifications_none, color: Color(0xFFFF8C42)),
                      ),
                      IconButton(
                        onPressed: () => _logout(context),
                        icon: const Icon(Icons.logout, color: Color(0xFFFF8C42)),
                        tooltip: 'Logout',
                      )
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Action Buttons Row
                Row(
                  children: [
                    Expanded(
                      child: GlassContainer(
                        borderRadius: BorderRadius.circular(24),
                        padding: const EdgeInsets.all(20),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () => _navigateToCreateJob(context),
                            borderRadius: BorderRadius.circular(24),
                            child: Column(
                              children: const [
                                Icon(Icons.add_circle_outline, color: Color(0xFFFF8C42), size: 32),
                                SizedBox(height: 8),
                                Text(
                                  'Create Job',
                                  style: TextStyle(
                                    color: Color(0xFFFF8C42),
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: GlassContainer(
                        borderRadius: BorderRadius.circular(24),
                        padding: const EdgeInsets.all(20),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () => _navigateToJobsList(context),
                            borderRadius: BorderRadius.circular(24),
                            child: Column(
                              children: const [
                                Icon(Icons.work_outline, color: Color(0xFFFF8C42), size: 32),
                                SizedBox(height: 8),
                                Text(
                                  'View Jobs',
                                  style: TextStyle(
                                    color: Color(0xFFFF8C42),
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Stats row
                Row(
                  children: const [
                    Expanded(
                      child: _StatCard(
                        icon: Icons.check_circle_outline,
                        title: 'Tasks',
                        value: '12',
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.timer_outlined,
                        title: 'Focus',
                        value: '3h 25m',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Quick actions list
                GlassContainer(
                  borderRadius: BorderRadius.circular(24),
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Column(
                    children: [
                      _GlassListTile(
                        icon: Icons.person_outline,
                        title: 'Profile',
                        subtitle: 'View and edit your info',
                        onTap: () {},
                      ),
                      _Divider(),
                      _GlassListTile(
                        icon: Icons.settings_outlined,
                        title: 'Settings',
                        subtitle: 'App preferences',
                        onTap: () {},
                      ),
                      _Divider(),
                      _GlassListTile(
                        icon: Icons.help_outline,
                        title: 'Help & Support',
                        subtitle: 'Get assistance',
                        onTap: () {},
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.title,
    required this.value,
  });

  final IconData icon;
  final String title;
  final String value;

  @override
  Widget build(BuildContext context) {
    return GlassContainer(
      borderRadius: BorderRadius.circular(24),
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withValues(alpha: 0.14),
            ),
            padding: const EdgeInsets.all(10),
            child: Icon(icon, color: Colors.white),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(color: Color(0xFFE0E0E0), fontSize: 12),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    color: Color(0xFFFF8C42),
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios, size: 14, color: Color(0xFFFF8C42)),
        ],
      ),
    );
  }
}

class _GlassListTile extends StatelessWidget {
  const _GlassListTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.12),
              ),
              padding: const EdgeInsets.all(10),
              child: Icon(icon, color: Colors.white70),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Color(0xFFFF8C42),
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: const TextStyle(color: Color(0xFFE0E0E0), fontSize: 12),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Color(0xFFFF8C42)),
          ],
        ),
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      height: 1,
      color: Colors.white.withValues(alpha: 0.10),
    );
  }
}

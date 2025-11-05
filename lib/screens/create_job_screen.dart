import 'package:flutter/material.dart';
import '../services/job_service.dart';
import '../widgets/glass.dart';

class CreateJobScreen extends StatefulWidget {
  const CreateJobScreen({super.key});

  @override
  State<CreateJobScreen> createState() => _CreateJobScreenState();
}

class _CreateJobScreenState extends State<CreateJobScreen> with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _jobService = JobService();
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  // Wizard state
  int _currentStep = 0;
  final PageController _pageController = PageController();

  // Controllers
  final _jobTitleController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _urlController = TextEditingController();

  // Dropdown selections
  int? _selectedGroupId;
  int? _selectedLegalEntityId;
  int? _selectedBrandId;
  int? _selectedCountryId;
  DateTime? _deliveryDate;
  String _artDeliveryMethod = 'By hand';

  // Multiple items selection
  final List<Map<String, dynamic>> _selectedItems = [];
  List<dynamic> _groups = [];
  List<dynamic> _legalEntities = [];
  List<dynamic> _brands = [];
  List<dynamic> _countries = [];
  List<dynamic> _items = [];
  List<dynamic> _locations = [];

  bool _isLoading = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0.3, 0),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _animationController, curve: Curves.easeOutCubic));
    
    _animationController.forward();
    _loadInitialData();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _pageController.dispose();
    _jobTitleController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _urlController.dispose();
    super.dispose();
  }

  Future<void> _loadInitialData() async {
    setState(() => _isLoading = true);
    try {
      final results = await Future.wait([
        _jobService.fetchGroups(),
        _jobService.fetchBrands(),
        _jobService.fetchCountries(),
        _jobService.fetchItems(),
        _jobService.fetchLocations(),
      ]);

      setState(() {
        _groups = results[0];
        _brands = results[1];
        _countries = results[2];
        _items = results[3];
        _locations = results[4];
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading data: $e')),
        );
      }
    }
  }

  Future<void> _loadLegalEntities(int groupId) async {
    try {
      final entities = await _jobService.fetchLegalEntities(groupId: groupId);
      setState(() {
        _legalEntities = entities;
        _selectedLegalEntityId = null;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading legal entities: $e')),
        );
      }
    }
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _deliveryDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => _deliveryDate = picked);
    }
  }

  Future<void> _submitJob() async {
    // Debug: verify submit is triggered
    // ignore: avoid_print
    print('Submitting job... step=$_currentStep');
    // Validate the basic form (step 1 fields live inside this Form)
    if (!(_formKey.currentState?.validate() ?? true)) return;
    
    if (_selectedGroupId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a group')),
      );
      return;
    }

    if (_deliveryDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please choose a delivery date')),
      );
      return;
    }

    if (_selectedCountryId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a country')),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      // Show a blocking progress dialog so the user sees activity, especially on Web
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (_) => const Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFF8C42)),
          ),
        ),
      );

      final deliveryDateValue = _deliveryDate;
      // Format as ISO8601 datetime with UTC timezone (YYYY-MM-DDTHH:mm:ss.sssZ)
      String? dateFormatted = deliveryDateValue?.toUtc().toIso8601String();

      // Map method to API expected values: 'hand', 'url', or 'email'
      String methodValue = _artDeliveryMethod.toLowerCase();
      if (methodValue == 'by hand') methodValue = 'hand';

      final jobData = <String, dynamic>{
        'name': _jobTitleController.text,
        'group': _selectedGroupId,
        'legalEntity': _selectedLegalEntityId ?? _selectedGroupId, // Fallback to group if not selected
        'brands': _selectedBrandId != null ? [_selectedBrandId] : [],
        'deliveryDate': dateFormatted,
        'method': methodValue,
        'country': _selectedCountryId,
        'items': _selectedItems.isEmpty ? [] : _selectedItems.map((item) => {
          'item': item['itemId'],
          'quantity': item['quantity'],
          'location': item['locationId'],
        }).toList(),
      };

      // Add method-specific fields
      if (_artDeliveryMethod == 'Email') {
        jobData['email'] = _emailController.text;
        jobData['password'] = _passwordController.text;
      } else if (_artDeliveryMethod == 'URL') {
        jobData['url'] = _urlController.text;
      }

      final resp = await _jobService.createJob(jobData);

      if (mounted) {
        // Close the loading dialog if still shown
        Navigator.of(context, rootNavigator: true).pop();
        final jobSequence = resp['sequence'] ?? resp['data']?['sequence'] ?? resp['successResult']?['sequence'];
        final goHome = await _showSuccessDialog(sequence: jobSequence?.toString());
        if (goHome == true && mounted) {
          Navigator.pop(context, true);
        }
      }
    } catch (e) {
      if (mounted) {
        // Close the loading dialog if still shown
        Navigator.of(context, rootNavigator: true).maybePop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  Future<bool?> _showSuccessDialog({String? sequence}) {
    return showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: const Color(0xFF1E1E1E),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Row(
            children: const [
              Icon(Icons.check_circle, color: Color(0xFFFF8C42)),
              SizedBox(width: 8),
              Text('Job Created', style: TextStyle(color: Colors.white)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (sequence != null) ...[
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF8C42).withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Center(
                    child: Text(
                      '#$sequence',
                      style: const TextStyle(
                        color: Color(0xFFFF8C42),
                        fontWeight: FontWeight.bold,
                        fontSize: 28,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
              ],
              Text(
                sequence != null
                    ? 'Your job #$sequence has been created successfully!'
                    : 'Your job has been created successfully!',
                style: const TextStyle(color: Color(0xFFE0E0E0)),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(true),
              child: const Text('Back to Home', style: TextStyle(color: Color(0xFFFF8C42))),
            ),
          ],
        );
      },
    );
  }

  void _nextStep() {
    if (_currentStep < 2) {
      _animationController.reset();
      setState(() => _currentStep++);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
      _animationController.forward();
    } else {
      _submitJob();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      _animationController.reset();
      setState(() => _currentStep--);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
      _animationController.forward();
    }
  }

  bool _canProceed() {
    switch (_currentStep) {
      case 0:
        return _jobTitleController.text.isNotEmpty &&
               _selectedGroupId != null &&
               _selectedCountryId != null &&
               _deliveryDate != null;
      case 1:
        if (_artDeliveryMethod == 'Email') {
          return _emailController.text.isNotEmpty &&
                 _passwordController.text.isNotEmpty;
        } else if (_artDeliveryMethod == 'URL') {
          return _urlController.text.isNotEmpty;
        }
        return true;
      case 2:
        return true;
      default:
        return false;
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
                _buildProgressIndicator(),
                Expanded(
                  child: _isLoading
                      ? const Center(
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFF8C42)),
                          ),
                        )
                      : PageView(
                          controller: _pageController,
                          physics: const NeverScrollableScrollPhysics(),
                          children: [
                            _buildStep1(),
                            _buildStep2(),
                            _buildStep3(),
                          ],
                        ),
                ),
                _buildNavigationButtons(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    final titles = ['Basic Information', 'Delivery Details', 'Related Items'];
    final icons = [Icons.info_outline, Icons.local_shipping_outlined, Icons.inventory_2_outlined];
    
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
          const SizedBox(width: 8),
          Icon(icons[_currentStep], color: const Color(0xFFFF8C42), size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Create New Job',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  titles[_currentStep],
                  style: const TextStyle(
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

  Widget _buildProgressIndicator() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
      child: Row(
        children: List.generate(3, (index) {
          final isActive = index == _currentStep;
          final isCompleted = index < _currentStep;
          
          return Expanded(
            child: Row(
              children: [
                Expanded(
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    height: 4,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(2),
                      color: isCompleted || isActive
                          ? const Color(0xFFFF8C42)
                          : Colors.white.withValues(alpha: 0.2),
                    ),
                  ),
                ),
                if (index < 2) const SizedBox(width: 8),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildStep1() {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildSectionHeader(Icons.work_outline, 'Job Details'),
                const SizedBox(height: 16),
                _buildTextField(
                  'Job Title',
                  _jobTitleController,
                  icon: Icons.title,
                  validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                ),
                const SizedBox(height: 16),
                _buildDropdown<int>(
                  'Group',
                  _selectedGroupId,
                  _groups,
                  Icons.group_outlined,
                  (val) {
                    setState(() => _selectedGroupId = val);
                    if (val != null) _loadLegalEntities(val);
                  },
                ),
                const SizedBox(height: 16),
                _buildDropdown<int>(
                  'Legal Entity',
                  _selectedLegalEntityId,
                  _legalEntities,
                  Icons.business_outlined,
                  (val) => setState(() => _selectedLegalEntityId = val),
                  enabled: _selectedGroupId != null,
                ),
                const SizedBox(height: 16),
                _buildDropdown<int>(
                  'Brand',
                  _selectedBrandId,
                  _brands,
                  Icons.local_offer_outlined,
                  (val) => setState(() => _selectedBrandId = val),
                ),
                const SizedBox(height: 16),
                _buildDatePicker(),
                const SizedBox(height: 16),
                _buildDropdown<int>(
                  'Country',
                  _selectedCountryId,
                  _countries,
                  Icons.public_outlined,
                  (val) => setState(() => _selectedCountryId = val),
                ),
                const SizedBox(height: 80),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStep2() {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildSectionHeader(Icons.local_shipping_outlined, 'Delivery Information'),
              const SizedBox(height: 16),
              _buildArtDeliveryMethod(),
              const SizedBox(height: 16),
              if (_artDeliveryMethod == 'Email') ...[
                _buildTextField(
                  'Email',
                  _emailController,
                  icon: Icons.email_outlined,
                  validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                ),
                const SizedBox(height: 16),
                _buildTextField(
                  'Password',
                  _passwordController,
                  icon: Icons.lock_outlined,
                  obscure: true,
                  validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                ),
              ],
              if (_artDeliveryMethod == 'URL') ...[
                _buildTextField(
                  'URL',
                  _urlController,
                  icon: Icons.link_outlined,
                  validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                ),
              ],
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep3() {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildSectionHeader(Icons.inventory_2_outlined, 'Related Items'),
              const SizedBox(height: 16),
              
              // List of selected items
              if (_selectedItems.isNotEmpty) ...[
                ..._selectedItems.asMap().entries.map((entry) {
                  final index = entry.key;
                  final item = entry.value;
                  final itemName = _items.firstWhere(
                    (i) => i['id'] == item['itemId'],
                    orElse: () => {'name': 'Unknown'},
                  )['name'];
                  final locationName = _locations.firstWhere(
                    (l) => l['id'] == item['locationId'],
                    orElse: () => {'name': 'Unknown'},
                  )['name'];
                  
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GlassContainer(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          const Icon(Icons.inventory_2, color: Color(0xFFFF8C42), size: 20),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  itemName?.toString() ?? 'Unknown',
                                  style: const TextStyle(
                                    color: Color(0xFFE0E0E0),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  'Qty: ${item['quantity']} • Location: ${locationName?.toString() ?? 'Unknown'}',
                                  style: const TextStyle(
                                    color: Color(0xFFB0B0B0),
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                            onPressed: () {
                              setState(() => _selectedItems.removeAt(index));
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                }),
                const SizedBox(height: 16),
              ],
              
              // Add new item section
              GlassContainer(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'Add Item',
                      style: TextStyle(
                        color: Color(0xFFE0E0E0),
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _buildItemSelector(),
                  ],
                ),
              ),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildItemSelector() {
    int? tempItemId;
    int? tempLocationId;
    int tempQuantity = 1;
    final quantityController = TextEditingController(text: '1');

    return StatefulBuilder(
      builder: (context, setLocalState) {
        return Column(
          children: [
            DropdownButtonHideUnderline(
              child: DropdownButtonFormField<int>(
                // ignore: deprecated_member_use
                value: tempItemId,
                isExpanded: true,
                icon: const Icon(Icons.arrow_drop_down, color: Color(0xFFFF8C42)),
                style: const TextStyle(color: Color(0xFFE0E0E0), fontSize: 16),
                dropdownColor: const Color(0xFF2A2A2A),
                decoration: const InputDecoration(
                  labelText: 'Select Item',
                  labelStyle: TextStyle(color: Color(0xFFB0B0B0)),
                  prefixIcon: Icon(Icons.category_outlined, color: Color(0xFFFF8C42)),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                hint: _items.isEmpty
                    ? Text(
                        'No items available',
                        style: TextStyle(color: Colors.grey.shade600),
                      )
                    : null,
                items: _items.isEmpty
                    ? <DropdownMenuItem<int>>[]
                    : _items.map((item) {
                        return DropdownMenuItem<int>(
                          value: item['id'] as int,
                          child: Text(
                            item['name']?.toString() ?? item['title']?.toString() ?? 'Unknown',
                            style: const TextStyle(color: Color(0xFFE0E0E0)),
                            overflow: TextOverflow.ellipsis,
                          ),
                        );
                      }).toList(),
                onChanged: _items.isEmpty
                    ? null
                    : (val) {
                        setLocalState(() => tempItemId = val);
                      },
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: quantityController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Color(0xFFE0E0E0)),
              decoration: const InputDecoration(
                labelText: 'Quantity',
                labelStyle: TextStyle(color: Color(0xFFB0B0B0)),
                prefixIcon: Icon(Icons.numbers_outlined, color: Color(0xFFFF8C42)),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onChanged: (val) {
                tempQuantity = int.tryParse(val) ?? 1;
              },
            ),
            const SizedBox(height: 12),
            DropdownButtonHideUnderline(
              child: DropdownButtonFormField<int>(
                // ignore: deprecated_member_use
                value: tempLocationId,
                isExpanded: true,
                icon: const Icon(Icons.arrow_drop_down, color: Color(0xFFFF8C42)),
                style: const TextStyle(color: Color(0xFFE0E0E0), fontSize: 16),
                dropdownColor: const Color(0xFF2A2A2A),
                decoration: const InputDecoration(
                  labelText: 'Select Location',
                  labelStyle: TextStyle(color: Color(0xFFB0B0B0)),
                  prefixIcon: Icon(Icons.location_on_outlined, color: Color(0xFFFF8C42)),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                hint: _locations.isEmpty
                    ? Text(
                        'No locations available',
                        style: TextStyle(color: Colors.grey.shade600),
                      )
                    : null,
                items: _locations.isEmpty
                    ? <DropdownMenuItem<int>>[]
                    : _locations.map((location) {
                        return DropdownMenuItem<int>(
                          value: location['id'] as int,
                          child: Text(
                            location['name']?.toString() ?? location['title']?.toString() ?? 'Unknown',
                            style: const TextStyle(color: Color(0xFFE0E0E0)),
                            overflow: TextOverflow.ellipsis,
                          ),
                        );
                      }).toList(),
                onChanged: _locations.isEmpty
                    ? null
                    : (val) {
                        setLocalState(() => tempLocationId = val);
                      },
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: () {
                if (tempItemId != null && tempQuantity > 0 && tempLocationId != null) {
                  setState(() {
                    _selectedItems.add({
                      'itemId': tempItemId,
                      'quantity': tempQuantity,
                      'locationId': tempLocationId,
                    });
                  });
                  // Reset local state
                  setLocalState(() {
                    tempItemId = null;
                    tempLocationId = null;
                    quantityController.text = '1';
                    tempQuantity = 1;
                  });
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Please select item, location, and enter a valid quantity')),
                  );
                }
              },
              icon: const Icon(Icons.add),
              label: const Text('Add Item'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF8C42),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildSectionHeader(IconData icon, String title) {
    return GlassContainer(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFFF8C42).withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: const Color(0xFFFF8C42), size: 24),
          ),
          const SizedBox(width: 12),
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFFE0E0E0),
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavigationButtons() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          if (_currentStep > 0) ...[
            Expanded(
              child: GlassContainer(
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: _previousStep,
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.arrow_back, color: Color(0xFFE0E0E0)),
                          SizedBox(width: 8),
                          Text(
                            'Previous',
                            style: TextStyle(
                              color: Color(0xFFE0E0E0),
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
            ),
            const SizedBox(width: 16),
          ],
          Expanded(
            flex: _currentStep == 0 ? 1 : 1,
            child: GlassContainer(
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {
                    // Debug: track taps on the primary action
                    // ignore: avoid_print
                    print('Primary action tapped. currentStep=$_currentStep, isSubmitting=$_isSubmitting');
                    if (_isSubmitting) return;
                    final canGo = _currentStep == 2 ? true : _canProceed();
                    if (!canGo) return;
                    if (_currentStep == 2) {
                      _submitJob();
                    } else {
                      _nextStep();
                    }
                  },
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    child: _isSubmitting
                        ? const Center(
                            child: SizedBox(
                              height: 24,
                              width: 24,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFFF8C42)),
                              ),
                            ),
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                _currentStep == 2 ? 'Create Job' : 'Next',
                                style: TextStyle(
                                  color: (_currentStep == 2 || _canProceed()) && !_isSubmitting
                                      ? const Color(0xFFFF8C42)
                                      : const Color(0xFFB0B0B0),
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Icon(
                                _currentStep == 2 ? Icons.check : Icons.arrow_forward,
                                color: (_currentStep == 2 || _canProceed()) && !_isSubmitting
                                    ? const Color(0xFFFF8C42)
                                    : const Color(0xFFB0B0B0),
                              ),
                            ],
                          ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    IconData? icon,
    bool obscure = false,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return GlassContainer(
      child: TextFormField(
        controller: controller,
        obscureText: obscure,
        keyboardType: keyboardType,
        style: const TextStyle(color: Color(0xFFE0E0E0)),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: Color(0xFFB0B0B0)),
          prefixIcon: icon != null
              ? Icon(icon, color: const Color(0xFFFF8C42))
              : null,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(16),
        ),
        validator: validator,
      ),
    );
  }

  Widget _buildDropdown<T>(
    String label,
    T? value,
    List<dynamic> items,
    IconData icon,
    void Function(T?) onChanged, {
    bool enabled = true,
  }) {
    final hasItems = items.isNotEmpty;
    return GlassContainer(
      child: DropdownButtonHideUnderline(
        child: DropdownButtonFormField<T>(
          // ignore: deprecated_member_use
          value: value,
          isExpanded: true,
          icon: const Icon(Icons.arrow_drop_down, color: Color(0xFFFF8C42)),
          style: const TextStyle(color: Color(0xFFE0E0E0), fontSize: 16),
          dropdownColor: const Color(0xFF2A2A2A),
          decoration: InputDecoration(
            labelText: label,
            labelStyle: const TextStyle(color: Color(0xFFB0B0B0)),
            prefixIcon: Icon(icon, color: const Color(0xFFFF8C42)),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
          hint: !hasItems
              ? Text(
                  'No items available',
                  style: TextStyle(color: Colors.grey.shade600),
                )
              : null,
          items: hasItems
              ? items.map((item) {
                  return DropdownMenuItem<T>(
                    value: item['id'] as T,
                    child: Text(
                      item['name']?.toString() ?? 
                      item['title']?.toString() ?? 
                      'Unknown',
                      style: const TextStyle(color: Color(0xFFE0E0E0)),
                      overflow: TextOverflow.ellipsis,
                    ),
                  );
                }).toList()
              : <DropdownMenuItem<T>>[],
          onChanged: enabled && hasItems ? onChanged : null,
        ),
      ),
    );
  }

  Widget _buildDatePicker() {
    return GlassContainer(
      child: InkWell(
        onTap: _selectDate,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              const Icon(Icons.calendar_today_outlined, color: Color(0xFFFF8C42)),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  _deliveryDate == null
                      ? 'Delivery Date'
                      : 'Delivery Date: ${_deliveryDate!.year}-${_deliveryDate!.month.toString().padLeft(2, '0')}-${_deliveryDate!.day.toString().padLeft(2, '0')}',
                  style: TextStyle(
                    color: _deliveryDate == null
                        ? const Color(0xFFB0B0B0)
                        : const Color(0xFFE0E0E0),
                    fontSize: 16,
                  ),
                ),
              ),
              const Icon(Icons.arrow_forward_ios, color: Color(0xFFFF8C42), size: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildArtDeliveryMethod() {
    return GlassContainer(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              children: const [
                Icon(Icons.delivery_dining_outlined, color: Color(0xFFFF8C42)),
                SizedBox(width: 12),
                Text(
                  'Art Delivery Method',
                  style: TextStyle(
                    color: Color(0xFFB0B0B0),
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          ...['By hand', 'URL', 'Email'].map((method) {
            final isSelected = _artDeliveryMethod == method;
            IconData methodIcon = Icons.back_hand_outlined;
            if (method == 'URL') methodIcon = Icons.link_outlined;
            if (method == 'Email') methodIcon = Icons.email_outlined;
            
            return InkWell(
              onTap: () => setState(() => _artDeliveryMethod = method),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  children: [
                    Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isSelected ? const Color(0xFFFF8C42) : const Color(0xFFB0B0B0),
                          width: 2,
                        ),
                      ),
                      child: isSelected
                          ? Center(
                              child: Container(
                                width: 10,
                                height: 10,
                                decoration: const BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Color(0xFFFF8C42),
                                ),
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 12),
                    Icon(methodIcon, 
                      color: isSelected ? const Color(0xFFFF8C42) : const Color(0xFFB0B0B0),
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Text(
                      method,
                      style: TextStyle(
                        color: isSelected ? const Color(0xFFE0E0E0) : const Color(0xFFB0B0B0),
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
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
}

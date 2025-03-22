class Customer {
  final int id;
  final String name;
  final String code;
  final String address;
  final int cityId; // Ubah menjadi int sesuai data JSON
  final double latitude;
  final double longitude;

  Customer({
    required this.id,
    required this.name,
    required this.code,
    required this.address,
    required this.cityId,
    required this.latitude,
    required this.longitude,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['customers_id'] ?? 0, 
      name: json['name'] ?? '',
      code: json['code'] ?? '',
      address: json['address'] ?? '',
      cityId: json['city_id'] ?? 0, // Mengonversi city_id menjadi int
      latitude: double.tryParse(json['latitude']) ?? 0.0, // Mengonversi latitude menjadi double
      longitude: double.tryParse(json['longitude']) ?? 0.0, // Mengonversi longitude menjadi double
    );
  }
}

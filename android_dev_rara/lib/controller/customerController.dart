import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../model/Customer.dart';

class customerController {
  static const String baseUrl = 'http://192.168.18.151:8000'; // Ganti dengan URL API Anda

 Future<List<Customer>> fetchCustomers() async {
  final response = await http.get(Uri.parse('$baseUrl/customer'));

  if (response.statusCode == 200) {
    List<dynamic> data = json.decode(response.body);
    print(data);
    if ( data.isNotEmpty) {
      return data.map((customer) => Customer.fromJson(customer)).toList();
    } else {
      return []; // Kembalikan list kosong jika data null atau kosong
    }
  } else {
    throw Exception('Failed to load customers');
  }
}
}

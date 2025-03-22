import 'package:flutter/material.dart';
import './page/customerList.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Customer Map App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: CustomerList(),
      debugShowCheckedModeBanner: false,
    );
  }

}
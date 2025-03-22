import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart'; 
import '../model/Customer.dart';
import 'package:permission_handler/permission_handler.dart';

class CustomerMap extends StatefulWidget {
  final Customer customer;

  CustomerMap({required this.customer});

  @override
  _CustomerMapState createState() => _CustomerMapState();
}

class _CustomerMapState extends State<CustomerMap> {
  late PermissionStatus _locationPermissionStatus;

  Future<void> _checkLocationPermission() async {
    _locationPermissionStatus = await Permission.location.request();
    if (_locationPermissionStatus.isGranted) {
      print("Izin lokasi diberikan");
    } else {
      print("Izin lokasi ditolak");
    }
  }

  @override
  void initState() {
    super.initState();
    _checkLocationPermission(); 
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.customer.name),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color.fromARGB(255, 147, 195, 234),
                Color.fromARGB(255, 98, 171, 232),
                Color.fromARGB(255, 123, 185, 235),
              ],
            ),
          ),
        ),
        elevation: 0,
      ),
      body: FlutterMap(
        options: MapOptions(
          initialCenter: LatLng(widget.customer.latitude, widget.customer.longitude), 
          minZoom: 6.0, 
          // maxZoom: 18.0,
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: ['a', 'b', 'c'],
          ),
          MarkerLayer(
            markers: [
              Marker(
                point: LatLng(widget.customer.latitude, widget.customer.longitude),
                width: 40, 
                height: 40, 
                child: Icon(
                  Icons.location_on,
                  color: Colors.red,
                  size: 40,
                ),
              ),
            ],
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (context) {
              return Dialog(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20.0),
                ),
                child: Container(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 400,
                        height: 100,
                        decoration: BoxDecoration(
                          color: const Color.fromARGB(255, 142, 195, 238),
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(20.0),
                            topRight: Radius.circular(20.0),
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Center(
                            child: Icon(
                              Icons.location_on, 
                              color: Colors.white,
                              size: 50.0,
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: 16.0),
                      Text(
                        'Customer Details',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 24.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 8.0),
                     Row(
                      children: [
                        Text(
                          'Name     :',
                          style: TextStyle(
                            fontSize: 18.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(width: 10), 
                        Expanded(
                          child: Text(
                            widget.customer.name,
                            style: TextStyle(
                              fontSize: 18.0,
                            ),
                            overflow: TextOverflow.ellipsis, 
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 5),
                    Row(
                      children: [
                        Text(
                          'Code      :',
                          style: TextStyle(
                            fontSize: 18.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            widget.customer.code,
                            style: TextStyle(
                              fontSize: 18.0,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 5),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start, 
                      children: [
                        Text(
                          'Address   :',
                          style: TextStyle(
                            fontSize: 16.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            widget.customer.address,
                            style: TextStyle(
                              fontSize: 16.0,
                            ),
                            softWrap: true, 
                          ),
                        ),
                      ],
                    ),
                    SizedBox(
                      height: 20,
                    )
                    ],
                  ),
                ),
              );
            },
          );
        },

        child: Icon(Icons.info, color: const Color.fromARGB(255, 3, 65, 117),),
        backgroundColor: const Color.fromARGB(255, 140, 197, 244)
      ),
    );
  }
}

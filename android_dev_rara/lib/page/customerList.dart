import 'package:flutter/material.dart';
import '../controller/customerController.dart';
import '../model/Customer.dart';
import 'customerMap.dart';

class CustomerList extends StatefulWidget {
  @override
  _CustomerListState createState() => _CustomerListState();
}

class _CustomerListState extends State<CustomerList> {
  late Future<List<Customer>> customers;

  @override
  void initState() {
    super.initState();
    customers = customerController().fetchCustomers();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(
          child: Text(
            "Customer List",
            style: TextStyle(
              fontSize: 25,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        automaticallyImplyLeading: false,
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
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          FutureBuilder<List<Customer>>(
            future: customers,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return Center(child: CircularProgressIndicator());
              }

              if (snapshot.hasError) {
                return Center(child: Text('Error: ${snapshot.error}'));
              }

              if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return Center(child: Text('No customers found.'));
              }

              List<Customer> customerList = snapshot.data!;

              return Expanded(
                child: ListView.builder(
                  itemCount: customerList.length,
                  itemBuilder: (context, index) {
                    final customer = customerList[index];
                    return GestureDetector(
                      onTap: () {
                        // Navigate to map screen with customer data
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => CustomerMap(
                              customer: customer,
                            ),
                          ),
                        );
                      },
                      child: Container(
                        margin: const EdgeInsets.all(10),
                        width: 350,
                        height: 150,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(0),
                          border: Border.all(width: 1, color: Colors.blueAccent),
                        ),
                        child: Column(
                          children: [
                            Padding(
                              padding: EdgeInsets.only(left: 20, top: 15, right: 20),
                              child: Row(
                                children: [
                                  Text(
                                    "Customer: ",
                                    style: TextStyle(color: Colors.grey),
                                  ),
                                  Text(customer.name,
                                    style: TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ),
                            Divider(
                              color: Colors.grey,
                              thickness: 0.5,
                              indent: 20,
                              endIndent: 20,
                            ),
                            ListTile(
                              title: Text(
                                "Details",
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(height: 5,),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.location_on,
                                        size: 18,
                                        color: Colors.grey,
                                      ),
                                      SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          "${customer.address}",
                                          style: TextStyle(fontSize: 12, color: Colors.black),
                                          overflow: TextOverflow.ellipsis, 
                                          softWrap: true,  
                                        ),
                                      ),
                                    ],
                                  ),
                                  SizedBox(height: 5,),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.location_city_sharp,
                                        size: 18,
                                        color: Colors.grey,
                                      ),
                                      SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          "Code : ${customer.code}",
                                          style: TextStyle(fontSize: 12, color: Colors.black),
                                          overflow: TextOverflow.ellipsis, 
                                          softWrap: true,  
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

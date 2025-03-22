import tkinter as tk
from tkinter import messagebox
from tkinter import font
import pyodbc
import mysql.connector
import datetime

# Connect SQL Server
def connect_sqlserver():
    try:
        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};"
            r"SERVER=BITCORPDIIO\SQLEXPRESS;"
            "DATABASE=mydb;" 
            "Trusted_Connection=yes;"
        )
        return conn
    except Exception as e:
        messagebox.showerror("Error", f"Koneksi SQL Server gagal: {e}")
        return None

# Connecte MySQL
def connect_mysql():
    try:
        conn = mysql.connector.connect(
            host="localhost",  
            user="root",  
            password="",  
            database="dev_rara" 
        )
        return conn
    except Exception as e:
        messagebox.showerror("Error", f"Koneksi MySQL gagal: {e}")
        return None

# From SQL Server to MySQL function
def copy_sqlserver_to_mysql():
    sql_conn = connect_sqlserver()
    mysql_conn = connect_mysql()
    
    if sql_conn and mysql_conn:
        try:
            sql_cursor = sql_conn.cursor()
            mysql_cursor = mysql_conn.cursor()

            sql_cursor.execute("SELECT customers_id, name, code, address, city_id, latitude, longitude, createdAt, updatedAt FROM customers")
            customers = sql_cursor.fetchall()

            for customer in customers:
                mysql_cursor.execute(
                    "INSERT INTO customers (name, code, address, city_id, latitude, longitude, createdAt, updatedAt) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", 
                    (customer[1], customer[2], customer[3], customer[4], customer[5], customer[6], customer[7], customer[8])
                )

            mysql_conn.commit()
            messagebox.showinfo("Success", "Data berhasil dicopy dari SQL Server ke MySQL")
        
        except Exception as e:
            messagebox.showerror("Error", f"Kesalahan dalam copy data: {e}")
        
        finally:
            sql_cursor.close()
            mysql_cursor.close()
            sql_conn.close()
            mysql_conn.close()

# Fromi MySQL to SQL Server function
def copy_mysql_to_sqlserver():
    sql_conn = connect_sqlserver()
    mysql_conn = connect_mysql()
    
    if sql_conn and mysql_conn:
        try:
            sql_cursor = sql_conn.cursor()
            mysql_cursor = mysql_conn.cursor()

            mysql_cursor.execute("SELECT customers_id, name, code, address, city_id, latitude, longitude, createdAt, updatedAt FROM customers")
            customers = mysql_cursor.fetchall()

            for customer in customers:
                sql_cursor.execute(
                    "INSERT INTO customers (name, code, address, city_id, latitude, longitude, createdAt, updatedAt) "
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                    (customer[1], customer[2], customer[3], customer[4], customer[5], customer[6], customer[7], customer[8])
                )

            sql_conn.commit()
            messagebox.showinfo("Success", "Data berhasil dicopy dari MySQL ke SQL Server")
        
        except Exception as e:
            messagebox.showerror("Error", f"Kesalahan dalam copy data: {e}")
        
        finally:
            sql_cursor.close()
            mysql_cursor.close()
            sql_conn.close()
            mysql_conn.close()

# UI 
root = tk.Tk()
root.title("Backup Data Customer")

root.geometry("400x300")  
root.config(bg="#f0f0f0") 

custom_font = font.Font(family="Helvetica", size=12, weight="bold")

label = tk.Label(root, text="Backup Data Customer", font=("Helvetica", 16, "bold"), bg="#f0f0f0", fg="#333")
label.pack(pady=20)

btn_copy_sql_to_mysql = tk.Button(root, text="Copy SQL Server -> MySQL", command=copy_sqlserver_to_mysql, 
                                  font=custom_font, bg="#4CAF50", fg="white", relief="solid", bd=2, width=25)
btn_copy_sql_to_mysql.pack(pady=10)

btn_copy_mysql_to_sql = tk.Button(root, text="Copy MySQL -> SQL Server", command=copy_mysql_to_sqlserver, 
                                  font=custom_font, bg="#2196F3", fg="white", relief="solid", bd=2, width=25)
btn_copy_mysql_to_sql.pack(pady=10)

root.mainloop()

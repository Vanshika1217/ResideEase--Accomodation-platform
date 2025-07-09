import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, backgroundColor: "#f8fafc" },
  section: { marginBottom: 10, padding: 10, borderBottom: "1px solid #ccc" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#1E3A8A" },
  text: { marginBottom: 4 },
  boldText: { fontWeight: "bold" },
  priceBreakup: { marginTop: 10, paddingTop: 10, borderTop: "1px solid #ccc" },
  total: { fontSize: 14, fontWeight: "bold", marginTop: 5 }
});

const BookingReceipt = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Hotel Booking Receipt</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Name:</Text> {formData.FirstName} {formData.LastName}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Email:</Text> {formData.EmailId}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Phone:</Text> {formData.PhoneNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}><Text style={styles.boldText}>Destination:</Text> {formData.destination}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Check-in:</Text> {formData.checkIn}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Check-out:</Text> {formData.checkOut}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Guests:</Text> {formData.guests}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Rooms:</Text> {formData.rooms}</Text>
      </View>
      <View style={styles.priceBreakup}>
        <Text style={styles.text}><Text style={styles.boldText}>Base Price:</Text> ₹ 23,500</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Hotel Taxes:</Text> ₹ 4,230</Text>
        <Text style={styles.total}><Text style={styles.boldText}>Total Amount:</Text> ₹ 27,730</Text>
      </View>
    </Page>
  </Document>
);

export default BookingReceipt;
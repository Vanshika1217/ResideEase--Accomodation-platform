import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, backgroundColor: "#f8fafc" },
  section: { marginBottom: 10, padding: 10, borderBottom: "1px solid #ccc" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#1E3A8A" },
  text: { marginBottom: 4 },
  boldText: { fontWeight: "bold" },
  total: { fontSize: 14, fontWeight: "bold", marginTop: 5 }
});

const PGBookingReceipt = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>PG Booking Receipt</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Name:</Text> {formData.fullName}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Email:</Text> {formData.email}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Phone:</Text> {formData.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}><Text style={styles.boldText}>PG Name:</Text> {formData.pgName}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Gender:</Text> {formData.gender}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Sharing Type:</Text> {formData.sharingType}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Stay Duration:</Text> {formData.stayDuration}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Amenities:</Text> {formData.selectedAmenities.join(", ") || "None"}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Document:</Text> {formData.document?.name || "Not Uploaded"}</Text>
      </View>

      <View>
        <Text style={styles.total}><Text style={styles.boldText}>Total Monthly Rent:</Text> ₹ 7500</Text>
      </View>
    </Page>
  </Document>
);

export default PGBookingReceipt;

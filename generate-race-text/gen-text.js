const csv = require("csv-parse/sync");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Read and process the CSV file
const processCSV = () => {
  // Read the file
  const fileContent = fs.readFileSync("race_text_rows.csv", "utf-8");

  // Parse the CSV content
  const records = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Transform the records
  const transformedRecords = records.map((record) => {
    const { id, ...rest } = record; // Remove the old id
    return {
      id: uuidv4(), // Add new UUID
      ...rest, // Spread the rest of the properties
    };
  });

  // Create the CSV header
  const header = "id,created_at,type,text,length\n";

  // Convert records back to CSV format
  const outputRows = transformedRecords.map((record) => `${record.id},${record.created_at},${record.type},"${record.text}",${record.length}`);

  // Write the transformed data back to file
  fs.writeFileSync("transformed_file.csv", header + outputRows.join("\n"), "utf-8");
};

processCSV();

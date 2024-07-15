import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const CSVTool = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split("\n");
        const parsedData = rows.map(row => row.split(","));
        setCsvData(parsedData);
        toast.success("CSV file uploaded successfully");
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CSV Management Tool</h1>
      <p className="mb-4">Upload, edit, and manage your CSV files with ease.</p>

      <div className="mb-4">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-2"
        />
        {fileName && <p>Uploaded file: {fileName}</p>}
      </div>

      {csvData.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              {csvData[0].map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.slice(1).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-4">
        <Button className="mr-2">Add Row</Button>
        <Button>Download CSV</Button>
      </div>
    </div>
  );
};

export default CSVTool;
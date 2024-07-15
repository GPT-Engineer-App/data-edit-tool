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

  const handleCellEdit = (rowIndex, cellIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][cellIndex] = value;
    setCsvData(newData);
  };

  const handleAddRow = () => {
    const newRow = new Array(csvData[0].length).fill("");
    setCsvData([...csvData, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    const newData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(newData);
  };

  const handleDownloadCSV = () => {
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName || "data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        <div className="overflow-x-auto">
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
                    <TableCell key={cellIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleCellEdit(rowIndex + 1, cellIndex, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRow(rowIndex + 1)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-4">
        <Button onClick={handleAddRow} className="mr-2">Add Row</Button>
        <Button onClick={handleDownloadCSV}>Download CSV</Button>
      </div>
    </div>
  );
};

export default CSVTool;
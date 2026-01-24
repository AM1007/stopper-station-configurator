import * as XLSX from "xlsx";
import type { SavedConfiguration } from "../types";
import { MODEL_NAMES } from "../types";

interface MyListRow {
  "№": number;
  "Product Code": string;
  "Model": string;
  "Date Added": string;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}

function buildRows(items: SavedConfiguration[]): MyListRow[] {
  return items.map((item, index) => ({
    "№": index + 1,
    "Product Code": item.productCode,
    "Model": MODEL_NAMES[item.modelId] ?? item.modelId,
    "Date Added": formatDate(item.savedAt),
  }));
}

export function downloadMyListXlsx(items: SavedConfiguration[]): void {
  if (items.length === 0) {
    return;
  }

  const rows = buildRows(items);

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const columnWidths = [
    { wch: 5 },   // №
    { wch: 25 },  // Product Code
    { wch: 30 },  // Model
    { wch: 12 },  // Date Added
  ];
  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "My List");

  const timestamp = formatTimestamp();
  const filename = `my-list-${timestamp}.xlsx`;

  XLSX.writeFile(workbook, filename);
}
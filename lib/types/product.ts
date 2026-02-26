// Product interface for Firestore
export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  postfix: string; // e.g., "per piece", "bundle of 12", "per kg"
  categories: string[]; // Array of category IDs
  createdAt?: any; // Firestore Timestamp
}

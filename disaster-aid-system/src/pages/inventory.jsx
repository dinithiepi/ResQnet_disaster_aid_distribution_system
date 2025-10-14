import { useState } from "react";

export default function Inventory() {
  const [items] = useState([
    { name: "Water Bottles", count: 120 },
    { name: "Blankets", count: 75 },
    { name: "Canned Food", count: 200 },
  ]);

  return (
    <div>
      <h2>Inventory</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

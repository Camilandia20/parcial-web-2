import React, { useState } from 'react';

function DynamicTable() {
    const [rows, setRows] = useState([
        { name: '', age: '' }
    ]);

    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const addRow = () => {
        setRows([...rows, { name: '', age: '' }]);
    };

    const removeRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    return (
        <div>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <td>
                                <input
                                    type="text"
                                    value={row.name}
                                    onChange={e => handleChange(idx, 'name', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.age}
                                    onChange={e => handleChange(idx, 'age', e.target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={() => removeRow(idx)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addRow}>Agregar fila</button>
        </div>
    );
}

export default DynamicTable;
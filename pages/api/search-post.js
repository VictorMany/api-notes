import { connectToDatabase } from '../../lib/dbConnect';
import { ObjectId } from 'mongodb';

async function getNotes(req, res) {
    try {
        const { db } = await connectToDatabase();
        // Obtén el título de los parámetros de la solicitud, si se proporciona
        const titleQuery = req.query.name || '';
        // Construye una consulta que busque notas con títulos que contengan la cadena proporcionada
        const query = { title: { $regex: titleQuery, $options: 'i' } }; // La opción 'i' hace que la búsqueda sea insensible a mayúsculas y minúsculas
        // Realiza la consulta a la base de datos
        const notes = await db
            .collection('notes')
            .find(query)
            .sort({ due_date: -1 })
            .toArray();

        return res.json({ message: "Getting notes successfully", data: JSON.parse(JSON.stringify(notes)), success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export default async function handler(req, res) {
    try {
        await connectToDatabase();

        switch (req.method) {
            case 'GET':
                await getNotes(req, res);
                break;

            case 'OPTIONS':
                // Manejar la solicitud OPTIONS aquí
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE'); // Agregar los métodos permitidos
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Agregar los encabezados permitidos
                res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir cualquier origen (ajusta esto según tus necesidades)
                res.status(200).end(); // Responder con éxito
                break;

            default:
                res.status(405).end(); // Método no permitido
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

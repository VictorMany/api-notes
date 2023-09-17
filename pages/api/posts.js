import { connectToDatabase } from '../../lib/dbConnect';
import { ObjectId } from 'mongodb';

async function getNotes(req, res) {
    try {
        const { db } = await connectToDatabase();
        const notes = await db
            .collection('notes')
            .find({})
            .sort({ published: 1, createdAt: 1 })
            .toArray();

        return res.json({ message: "Getting notes successfully", data: JSON.parse(JSON.stringify(notes)), success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function addNote(req, res) {
    try {
        const { db } = await connectToDatabase();
        const note = JSON.parse(req.body);
        const result = await db.collection('notes').insertOne(note);
        const insertedNote = await db.collection('notes').findOne({ _id: result.insertedId });
        return res.json({ message: 'Note added successfully', success: true, data: insertedNote });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function updateNote(req, res) {
    
    try {
        const { db } = await connectToDatabase();

        const payload = JSON.parse(req.body);
        const noteId = new ObjectId(payload._id);

        delete payload._id

        console.log("ACTUALIZANDO el payload", noteId)

        const result = await db.collection('notes').updateOne(
            { _id: noteId },
            {
                $set: {
                    is_completed: payload.is_completed,
                    title: payload.title, // Update the 'title' field
                    details: payload.details, // Update the 'content' field
                    due_date: payload.due_date // Update the 'content' field
                }
            });
        console.log("EL RESULTADO DEL PUT ES", result)

        const insertedNote = await db.collection('notes').findOne({ _id: noteId });

        res.setHeader('Access-Control-Allow-Origin', '*'); // Permite todos los orígenes (cambia '*' por el dominio específico si es necesario)
        res.setHeader('Access-Control-Allow-Methods', 'PUT');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return res.json({ message: 'Note updated successfully', success: true, data: insertedNote });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function addBadgesImg(req, res) {
    try {
        const payload = JSON.parse(req.body);
        const { db } = await connectToDatabase();
        const noteId = new ObjectId(payload.id);

        await db.collection('notes').updateOne({ _id: noteId }, { $set: { imgs: payload.imgs } });

        return res.json({ message: 'Badges added successfully', success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function deleteNote(req, res) {
    try {
        const { db } = await connectToDatabase();
        const noteId = new ObjectId(req.body);

        await db.collection('notes').deleteOne({ _id: noteId });

        return res.json({ message: 'Note deleted successfully', success: true });
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

            case 'POST':
                await addNote(req, res);
                break;

            case 'PUT':
                await updateNote(req, res);
                break;

            case 'PATCH':
                await addBadgesImg(req, res);
                break;

            case 'DELETE':
                await deleteNote(req, res);
                break;

            default:
                res.status(405).end(); // Método no permitido
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

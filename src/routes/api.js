import { Router } from "express"
import { connection } from "../index.js"


const router = new Router();

router.get("/getAllVideos", (request, response) => {
	const query = `SELECT * FROM videos`
	connection.query(query, (error, results) => {
		if (error) throw error
		response.send(results)
	})

});
router.get("/video", (request, response) => {
	connection.query('SELECT * FROM videos WHERE id = ?', request.query.id,
		(error, results, fields) => {
			if (error) throw error;
			return response.status(200).json(video)
		})
});

router.post('/insertData', (request, response) => {
	const video = request.body
	connection.query(`INSERT INTO videos SET ?`, video, (error, results, fields) => {
		if (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				// Manejo específico para errores de duplicación
				return response.status(400).json({ error: 'El registro ya existe.' });
			} else {
				// Otro tipo de error, se puede manejar de manera diferente
				return response.status(500).json({ error: 'url incorrecta' });
			}
			
		}
		return response.status(200).json(video)
	})


});

router.delete('/eliminarVideo/:id', (request, response) => {
	const { id } = request.params
	const query = `DELETE FROM videos WHERE id = '${id}'`;
	connection.query(query, (error, results) => {
		if (error) throw error;
		return response.status(200).json(results)
	});
});

export default router;

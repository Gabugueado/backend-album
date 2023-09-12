import admin from "firebase-admin"
import { Router } from "express"

import serviceAccount from "../../album-videos-d3fca-firebase-adminsdk-it0en-5bb3eb532e.json" assert { type: 'json' }


const router = new Router()

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://album-videos-d3fca-default-rtdb.firebaseio.com"
});

;
const db = admin.database()


router.get("/obtenerVideos", (request, response) => {
	
	db.ref('videos').once('value', (snapshot) => {
		
		const videosArray = [];
		const bdd = snapshot.val()
		for (const key in bdd) {
			videosArray.push({
				id: key,
				...bdd[key]
			})
		}
		return response.status(200).json(videosArray)

	})
});

router.post('/insertarVideo', async (request, response) => {
	
	const video = request.body
	const snapshot = await db.ref('videos').orderByChild('id').equalTo(video.id).once('value')
	
	if ( snapshot.exists() ) {
		response.status(400).json({ error: 'El video ya existe' });
	} else {
		db.ref('videos').push(video);
		response.status(201).json({ message: 'Video agregado correctamente' });
	}
});

router.delete('/eliminarVideoFB/:id', async (request, response) => {
	const { id } = request.params


	db.ref('videos').orderByChild('id').equalTo(id).once('value')
	.then((snapshot) => {
		if (snapshot.exists()) {
			snapshot.forEach((childSnapshot) => {
				const { key } = childSnapshot;
				// console.log('Clave del nodo a eliminar:', key);

				// Utiliza la clave para eliminar el nodo
				db.ref('videos').child(key).remove()
					.then(() => {
						response.status(200).send('Video eliminado correctamente');
					})
					.catch(() => {
						response.status(500).send('Error al eliminar el video');
					});
			});
		} else {
			response.status(404).send('No se encontró el video');
		}
	})
	.catch((error) => {
		response.status(404).send('Error al buscar el ID');
		// console.error('Error al buscar el ID:', error);
	});
});

export default router;


// "videos": {
// 	"-Ndm7neBEItChW1CqcsA" : {
// 		"descripcion" : "Hablemos del Laaaaa aaaa cri moooo saaaaa (sadface.jpg)",
// 		"duracion" : "13:29",
// 		"id" : "1KqbzO_entM",
// 		"img" : "https://i.ytimg.com/vi/1KqbzO_entM/sddefault.jpg",
// 		"titulo" : "lo último que escribió Mozart antes de morir",
// 		"url" : "https://www.youtube.com/watch?v=1KqbzO_entM&list=PLrNRWzkImhnzSGd771iyaswnwE6eyyvhe&index=11",
// 	},
// 	"-Ndm7pw_GukQpp8455MM" : {
// 		"descripcion" : "00:00 Intro",
// 		"duracion" : "23:15",
// 		"id" : "NdQ-RfD3P7Y",
// 		"img" : "https://i.ytimg.com/vi/NdQ-RfD3P7Y/sddefault.jpg",
// 		"titulo" : "Todo sobre mí (2022) | Especial 3 millones de suscriptores",
// 		"url" : "https://www.youtube.com/watch?v=NdQ-RfD3P7Y&list=PLrNRWzkImhnzSGd771iyaswnwE6eyyvhe&index=10",
// 	},
// }
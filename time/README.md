# Time
```javascript
// Utilisation du singleton Time 
const time = new Time();
time.onInit(async () => {}); // Optionnel
time.onTick(() => {}); // Optionnel
time.onDraw(() => {}); // Optionnel
time.start();

// Attributs statiques disponibles
Time.now // Temps en secondes (depuis l'ouverture de l'onglet)
Time.lastTime // Temps en secondes à l'image d'avant
Time.delta // Durée d'une image
Time.fps // Nombre d'images par seconde
```

import { APP_NAME, PORT } from './config';
import app from './';

app.listen(PORT, () => {
    console.log(`${APP_NAME} is listening on port ${PORT}...`);
});

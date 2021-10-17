import app from './api';
import config from './config';

app.listen(config.PORT, () => {
    console.log(`Server started on port ${config.PORT}`)
});


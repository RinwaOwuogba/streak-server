import loader from './loaders';
import app from './api';
import config from './config';

const startApp = async () => {
  await loader(app);
  console.log('Dependencies loaded!');

  app
    .listen(config.PORT, () => {
      console.log(`Server started on port ${config.PORT}`);
    })
    .on('error', (err) => {
      console.error(err);
      process.exit(1);
    });
};

startApp();

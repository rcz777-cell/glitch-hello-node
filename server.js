const fastify = require('fastify')({ logger: true });

const names = [];

fastify.post('/names', async (request, reply) => {
  const { name } = request.body || {};
  if (typeof name !== 'string' || name.trim() === '') {
    return reply.status(400).send({ error: 'Name must be a non-empty string' });
  }
  names.push(name.trim());
  return reply.status(201).send({ message: 'Name added' });
});

fastify.get('/names', async () => {
  return names;
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server running at http://localhost:3000/`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

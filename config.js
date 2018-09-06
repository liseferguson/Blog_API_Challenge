//production environment
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://Tester1:testpassword1@ds239412.mlab.com:39412/blog-mongoose';
//development environment
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      'mongodb://localhost/blog-app';
exports.PORT = process.env.PORT || 8080;
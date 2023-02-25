import admin from 'firebase-admin'

const firebaseConfig = {
  apiKey: "AIzaSyA0N75BHzj4pGmaFgb1fFcuOS1CBXZ5UiY",
  authDomain: "wastemanagement-65034.firebaseapp.com",
  databaseURL: "https://wastemanagement-65034-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wastemanagement-65034",
  storageBucket: "wastemanagement-65034.appspot.com",
  messagingSenderId: "540665383546",
  appId: "1:540665383546:web:d97539d1d9330c55db09c3",
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": "wastemanagement-65034",
  "private_key_id": "14ee4fb29abd0c394fa7f8213dff425a3db6517a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCBf62f/0A4mbmf\n1cyKjsSJGB3PaTOdd3+sgrf+rxouWOlcXfknEmjgW2dzUSNNGU6rcbjotBoYiDKc\ns08Ge14Y8mGHd01nG5+0ZBTF+y0I/PN3k/7cV68LOtZVCA5bIeyIQv+TJqUsemiZ\nguP33vlnkfvpx9EEvfvZdf72wHdsKzeexGSAgwSWLkrQSBVfmvt7TWQSFY6uWMdC\nlBjvW19GnZy986+EEWx6JnzLbE20xT06E+I/Dfp0NNJpZA67wHpwO54AR6DfNwDx\nKqUuyk86dVWoNNliozfyiarC39J4vXTaZy+d1kgRkvp6mSpAxr0hUI3MKC+kawHq\nJznxKjzHAgMBAAECggEAH4A1dgQbVSlf1Ben59SOzmKFbdzDZ3yYHBi4NUXW8otC\nSOu7HdwGkvzpD04fbjPHxUCmoESfTHRlC2U6xfLgkuTzAIbu1zQLB1CJFRfifps5\nhk8D4gmaVPr9BDYvd8+qwAK8NMljyIwGQcFrPvKIbL9ALkAjAipMxztCyDdNVYxd\nKBmO1XpTnk+dBYPx6HaJvjIvtxca7O+uOG9nbABrXeXDiJ/qZzDo/tC9ZYJy6QLY\ntB3Xq8iA5b4jZ1r6R/Dsd1A/Dl0RINItt7oeSwAUdAoNXEpNnTKJvm2fplczuBv0\nxfKRF6ltSjOGyBBTPmRwuPHO6XysPnxk2vXWY9pDcQKBgQC21fm1S509Z7RvxyHz\nf/IcIqTl3Iw6Aw2pKybvFiinOsSKGjc9TVGTXMXA2EK/7rkk+tlcomJM9poSLJoC\nalVo259FkePq08VqwmsUtB40CuV4DBC6xKD1GV29g615PvEy4SAY3ZmOUXmXnW6S\nX59Boggl/ofuLAvgRdnwYXkrRQKBgQC1UcG9tOUePSpg0ItXJfSRSqgTsMk9/oeK\nxYkbZ9RnNEOtJT0GF5uFfO2wk55ShwnqVk/BGP2QSvjuE2KTKP8WM5NYzotJZYqY\nwOFyZncPAwIlQZQDxqI3yOYSgKLiLmbaHFwDF42tAZJJ6oJQeSJbpcgquqbgRG3Z\n76sDdMSCmwKBgAUAi6ljHTUt3ijkuNARow0UAZDsXMXFiZ0kOhd2crxIhlIE75f0\nwpOWiS6CfCkGHfieCE5Zfvj+Ei8HG1uPjzCkOZJMsICfNJp8ITPazay805RaOCbz\n9Ddgb0kdDiTwDOdIc3larrXPEtWMEBdfGFtSVIi9kvh4KgcDwjeqYwdFAoGAa5Lf\n4Q9Lx87+L4ZKxR+NpA2o/lWqb49tFxXvLEVDrR9C75ziQZUL/fyKgHJ0Qf5AEbm3\ng5ayCUORwJ3bo/d0r9VVnCCeXqNRwSLeHqNQC6X7ReNMT5kvcO1OIrgS6yIgf1LH\n/EWjFnuSMSxiuB/GFJ2czk0C6JdwnRYmXdyPIfUCgYEAl7l9SpbYFukHGfy0n2T9\nf49+Ko6+7J/OG/j9agAxi+ghsc19O9fKMf6YbQl7H7OXTNdu4mb7sXp08jOWYv9X\neDVw2S1igVlKWGPFvp65xKPRJV5onVabhPlFhW8pKlULYorzciIETwDN90M6jsI6\n0mo/I8pU01AO5VOpyYHjESA=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-kzzcx@wastemanagement-65034.iam.gserviceaccount.com",
  "client_id": "105055389465335053721",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kzzcx%40wastemanagement-65034.iam.gserviceaccount.com"})
}

const db = admin.initializeApp(firebaseConfig)

export { firebaseConfig,db}
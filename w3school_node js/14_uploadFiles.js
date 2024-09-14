import http from 'http';
import formidable from 'formidable';

http.createServer((req, res) => {
  if (req.url == '/fileupload' && req.method.toLowerCase() == 'post') {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.write('Received upload:\n\n');
      res.end(JSON.stringify({ fields, files }, null, 2));
    });

    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
  res.write('<input type="file" name="filetoupload"><br>');
  res.write('<input type="submit">');
  res.write('</form>');
  return res.end();
}).listen(8080);

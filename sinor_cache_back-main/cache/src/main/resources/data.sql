INSERT INTO product(product_id, product_name, product_price) values (1, '노트북', 23110);
INSERT INTO product(product_id, product_name, product_price) values (2, '마우스', 23222);
INSERT INTO product_detail(id, product_comment, product_phone, product_id) values (1, '노트북입니다.', '010-2554-5161', 1);
INSERT INTO product_detail(id, product_comment, product_phone, product_id) values (2, '마우스입니다.', '010-2214-5161', 2);
INSERT INTO options(id, url, expired_time) values (1, '/app/products', 25);
INSERT INTO options(id, url, expired_time) values (2, 'appUsers', 40);
CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE colors (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE brands (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL
);

create table products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    brand_id INT UNSIGNED not null,
	category_id INT UNSIGNED not null,
	color_id INT UNSIGNED,
    image text not null,

    price decimal(10,2) not null,
    is_sale INT,
    sale_price decimal(10,2),

    created_at timestamp default current_timestamp,

    foreign key (brand_id) references brands(id) on delete restrict,
    foreign key (category_id) references categories(id) on delete restrict,
    foreign key (color_id) references colors(id) on delete set null
);


CREATE TABLE product_sizes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_uuid VARCHAR(36) NOT NULL,
    size VARCHAR(20) NOT NULL,
    qty INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_uuid) REFERENCES products(uuid) ON DELETE CASCADE,
    UNIQUE(product_uuid, size)  -- <- tylko kombinacja musi być unikalna
);

ALTER TABLE products
ADD COLUMN size_type VARCHAR(20) NOT NULL DEFAULT 'sizes' AFTER sale_price,
ADD COLUMN qty INT NULL AFTER size_type;

CREATE TABLE materials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE parts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE dimensions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE search_product (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_uuid VARCHAR(36) NOT NULL,
  full_name TEXT NOT NULL,
  FOREIGN KEY (product_uuid) REFERENCES products(uuid) ON DELETE CASCADE
);
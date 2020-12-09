<?php

$_POST = json_decode(file_get_contents("php://input", true)); //в php коде получить json данные
echo var_dump($_POST);
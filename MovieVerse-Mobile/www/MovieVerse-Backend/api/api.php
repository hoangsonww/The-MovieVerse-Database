<?php
header("Content-Type: application/json; charset=UTF-8");

include_once 'database.php';
include_once 'movie.php';

$database = new Database();
$db = $database->getConnection();

$movie = new Movie($db);

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch($requestMethod) {
    case 'GET':
        $stmt = $movie->read();
        $itemCount = $stmt->rowCount();
        if($itemCount > 0) {
            $movieArr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($movieArr, $row);
            }
            http_response_code(200);
            echo json_encode($movieArr);
        }
        else {
            http_response_code(404);
            echo json_encode(array("message" => "No records found."));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $movie->title = $data->title;
        $movie->overview = $data->overview;
        $movie->poster_path = $data->poster_path;
        $movie->vote_average = $data->vote_average;
        $movie->release_date = $data->release_date;

        if($movie->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Movie was created."));
        }
        else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create movie."));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $movie->id = $data->id;
        $movie->title = $data->title;
        $movie->overview = $data->overview;
        $movie->poster_path = $data->poster_path;
        $movie->vote_average = $data->vote_average;
        $movie->release_date = $data->release_date;

        if($movie->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Movie was updated."));
        }
        else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update movie."));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        $movie->id = $data->id;

        if($movie->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Movie was deleted."));
        }
        else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete movie."));
        }
        break;

    case 'OPTIONS':
        http_response_code(200);
        break;

    case 'HEAD':
        http_response_code(200);
        break;

    case 'PATCH':
        http_response_code(200);
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}

?>

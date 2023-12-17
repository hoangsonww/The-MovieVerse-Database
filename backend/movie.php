<?php

class Movie {
    private $conn;
    private $table_name = "movies";

    public $id;
    public $title;
    public $overview;
    public $poster_path;
    public $vote_average;
    public $release_date;

    public function __construct($db) {
        $this->conn = $db;
    }

    function readGenreAll() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        return $stmt;
    }

    function readGenreAllPaging($genre, $from_record_num, $records_per_page) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT ?, ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(3, $records_per_page, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function create() {
        $query = "INSERT INTO " . $this->table_name . " SET title=:title, overview=:overview, poster_path=:poster_path, vote_average=:vote_average, release_date=:release_date";
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->title=htmlspecialchars(strip_tags($this->title));
        $this->overview=htmlspecialchars(strip_tags($this->overview));
        $this->poster_path=htmlspecialchars(strip_tags($this->poster_path));
        $this->vote_average=htmlspecialchars(strip_tags($this->vote_average));
        $this->release_date=htmlspecialchars(strip_tags($this->release_date));

        // bind values
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":overview", $this->overview);
        $stmt->bindParam(":poster_path", $this->poster_path);
        $stmt->bindParam(":vote_average", $this->vote_average);
        $stmt->bindParam(":release_date", $this->release_date);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    function update() {
        $query = "UPDATE " . $this->table_name . " SET title=:title, overview=:overview, poster_path=:poster_path, vote_average=:vote_average, release_date=:release_date WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->title=htmlspecialchars(strip_tags($this->title));
        $this->overview=htmlspecialchars(strip_tags($this->overview));
        $this->poster_path=htmlspecialchars(strip_tags($this->poster_path));
        $this->vote_average=htmlspecialchars(strip_tags($this->vote_average));
        $this->release_date=htmlspecialchars(strip_tags($this->release_date));

        // bind values
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":overview", $this->overview);
        $stmt->bindParam(":poster_path", $this->poster_path);
        $stmt->bindParam(":vote_average", $this->vote_average);
        $stmt->bindParam(":release_date", $this->release_date);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id=htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    function search($keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE title LIKE ? OR overview LIKE ? ORDER BY release_date DESC";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->execute();
        return $stmt;

    function readPaging($from_record_num, $records_per_page) {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY release_date DESC LIMIT ?, ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    public function count() {
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total_rows'];
    }

    function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readPopular() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY vote_average DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readLatest() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY release_date DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readTopRated() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY vote_average DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readUpcoming() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY release_date DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readNowPlaying() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY release_date DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readGenre($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        return $stmt;
    }

    function readGenrePaging($genre, $from_record_num, $records_per_page) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT ?, ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(3, $records_per_page, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    function countGenre($genre) {
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . " WHERE genre = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total_rows'];
    }

    function readGenrePopular($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY vote_average DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        return $stmt;
    }

    function readGenreLatest($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        return $stmt;
    }

    function readGenreTopRated($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY vote_average DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        return $stmt;
    }

    function readGenreUpcoming($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        return $stmt;
    }

    function readGenreNowPlaying($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT 0,5";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        return $stmt;
    }

    function readGenreSearch($genre, $keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? AND title LIKE ? OR overview LIKE ? ORDER BY release_date DESC";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->execute();
        return $stmt;
    }

    function readGenreSearchPaging($genre, $keywords, $from_record_num, $records_per_page) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? AND title LIKE ? OR overview LIKE ? ORDER BY release_date DESC LIMIT ?, ?";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->bindParam(4, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(5, $records_per_page, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt;
    }

    function countGenreSearch($genre, $keywords) {
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name . " WHERE genre = ? AND title LIKE ? OR overview LIKE ?";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total_rows'];
    }

    function readGenreOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenrePopularOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY vote_average DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreLatestOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreTopRatedOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY vote_average DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreUpcomingOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreNowPlayingOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreSearchOne($genre, $keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? AND title LIKE ? OR overview LIKE ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreSearchPopularOne($genre, $keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? AND title LIKE ? OR overview LIKE ? ORDER BY vote_average DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreSearchLatestOne($genre, $keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? AND title LIKE ? OR overview LIKE ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreSearchTopRatedOne($genre, $keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? AND title LIKE ? OR overview LIKE ? ORDER BY vote_average DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreSearchUpcomingOne($genre, $keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? AND title LIKE ? OR overview LIKE ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreSearchNowPlayingOne($genre, $keywords) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? AND title LIKE ? OR overview LIKE ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";
        $stmt->bindParam(1, $genre);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreAllOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row['id'];
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreAllPopularOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY vote_average DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row['id'];
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreAllLatestOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row['id'];
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreAllTopRatedOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY vote_average DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row['id'];
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function readGenreAllUpcomingOne($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row['id'];
        $this->title = $row['title'];
        $this->overview = $row['overview'];
        $this->poster_path = $row['poster_path'];
        $this->vote_average = $row['vote_average'];
        $this->release_date = $row['release_date'];
    }

    function getGenre($genre) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE genre = ? ORDER BY release_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $genre);
        $stmt->execute();
        return $stmt;
    }
}

?>

```

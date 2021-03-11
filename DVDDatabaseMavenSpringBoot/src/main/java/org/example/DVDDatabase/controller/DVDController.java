package org.example.DVDDatabase.controller;

import org.example.DVDDatabase.data.DVDDao;
import org.example.DVDDatabase.models.DVD;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dvds")
public class DVDController {
    private final DVDDao dao;

    public DVDController(DVDDao dao) {
        this.dao = dao;
    }

    @GetMapping
    public List<DVD> all() {
        return dao.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DVD create(@RequestBody DVD dvd) {
        return dao.add(dvd);
    }

    @GetMapping("/dvd/{dvdId}")
    public ResponseEntity<DVD> findByDVDId(@PathVariable int dvdId) {
        DVD result = dao.findByDVDId(dvdId);
        if (result == null) {
            return new ResponseEntity(null, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(result);
    }
    @GetMapping("/title/{title}")
    public ResponseEntity<List<DVD>> findByTitle(@PathVariable String title) {
        List<DVD> result = dao.findByTitle(title);
        if (result == null) {
            return new ResponseEntity(null, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(result);
    }
    @GetMapping("/year/{releaseYear}")
    public ResponseEntity<List<DVD>> findByReleaseYear(@PathVariable int releaseYear) {
        List<DVD>  result = dao.findByReleaseYear(releaseYear);
        if (result == null) {
            return new ResponseEntity(null, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(result);
    }
    @GetMapping("/director/{directorName}")
    public ResponseEntity<List <DVD>> findByDirector(@PathVariable String directorName) {
        List<DVD> result = dao.findByDirector(directorName);
        if (result == null) {
            return new ResponseEntity(null, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(result);
    }
    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<DVD>> findByRating(@PathVariable String rating) {
        List<DVD> result = dao.findByRating(rating);
        if (result == null) {
            return new ResponseEntity(null, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/dvd/{id}")
    public ResponseEntity update(@PathVariable int id, @RequestBody DVD dvd) {
        ResponseEntity response = new ResponseEntity(HttpStatus.NOT_FOUND);
        if (id != dvd.getDVDId()) {
            response = new ResponseEntity(HttpStatus.UNPROCESSABLE_ENTITY);
        } else if (dao.update(dvd)) {
            response = new ResponseEntity(HttpStatus.NO_CONTENT);
        }
        return response;
    }

    @DeleteMapping("/dvd/{dvdId}")
    public ResponseEntity delete(@PathVariable int dvdId) {
        if (dao.deleteByDVDId(dvdId)) {
            return new ResponseEntity(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }
}

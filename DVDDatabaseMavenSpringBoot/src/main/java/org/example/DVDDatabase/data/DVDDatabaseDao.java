package org.example.DVDDatabase.data;

import org.example.DVDDatabase.models.DVD;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

@Repository
@Profile("database")
public class DVDDatabaseDao implements DVDDao {
    private final JdbcTemplate jdbcTemplate;
    @Autowired
    public DVDDatabaseDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

/*
    private int dvdId;
    private String title;
    private int releaseYear;
    private String director;
    private String rating;
    private String notes;

 */
    @Override
    public DVD add(DVD dvd) {

        final String sql = "INSERT INTO dvd(dvdId, title, releaseYear, director, rating, notes) VALUES(?,?,?,?,?,?);";
        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update((Connection conn) -> {

            PreparedStatement statement = conn.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS);

            statement.setInt(1, dvd.getDVDId());
            statement.setString(2, dvd.getTitle());
            statement.setInt(3, dvd.getReleaseYear());
            statement.setString(4, dvd.getDirector());
            statement.setString(5, dvd.getRating());
            statement.setString(6, dvd.getNotes());
            return statement;

        }, keyHolder);

        //dvd.setDVDId(keyHolder.getKey().intValue()); //WHY DOES THIS CAUSE ERRORS?

        return dvd;
    }

    @Override
    public List<DVD> getAll() {
        final String sql = "SELECT dvdId, title, releaseYear, director, rating, notes FROM dvd;";
        return jdbcTemplate.query(sql, new DVDMapper());

    }

    @Override
    public DVD findByDVDId(int dvdId) {
        final String sql = "SELECT * "
                + "FROM dvd WHERE dvdId = ?;";

        return jdbcTemplate.queryForObject(sql, new DVDMapper(), dvdId);

    }

    @Override
    public List<DVD>  findByTitle(String title) {
        final String sql = "SELECT dvdId, title, releaseYear, director, rating, notes "
                + "FROM dvd WHERE title = ?;";

        return jdbcTemplate.query(sql, new DVDMapper(), title);
    }


    @Override
    public List<DVD> findByReleaseYear(int releaseYear) {
        final String sql = "SELECT dvdId, title, releaseYear, director, rating, notes "
                + "FROM dvd WHERE releaseYear = ?;";

        return jdbcTemplate.query(sql, new DVDMapper(), releaseYear);
    }


    @Override
    public List<DVD> findByDirector(String director) {
        final String sql = "SELECT dvdId, title, releaseYear, director, rating, notes "
                + "FROM dvd WHERE director = ?;";

        return jdbcTemplate.query(sql, new DVDMapper(), director);
    }


    @Override
    public List<DVD> findByRating(String rating) {
        final String sql = "SELECT dvdId, title, releaseYear, director, rating, notes "
                + "FROM dvd WHERE rating = ?;";

        return jdbcTemplate.query(sql, new DVDMapper(), rating);
    }


    @Override
    public boolean update(DVD dvd) { //WHERE IS TITLE
        final String sql = "UPDATE dvd SET "
                + "dvdId = ?, "
                + "title = ?, "
                + "releaseYear = ?, "
                + "director = ?, "
                + "rating = ?, "
                + "notes = ? "
                    + "WHERE dvdId = ?;";

        return jdbcTemplate.update(sql,
                dvd.getDVDId(),
                dvd.getTitle(),
                dvd.getReleaseYear(),
                dvd.getDirector(),
                dvd.getRating(),
                dvd.getNotes(),
                    dvd.getDVDId()) > 0;

    }


    @Override
    public boolean deleteByDVDId(int dvdId) {
        final String sql = "DELETE FROM dvd WHERE dvdId = ?;";
        return jdbcTemplate.update(sql, dvdId) > 0;

    }



    private static final class DVDMapper implements RowMapper<DVD> {

        @Override
        public DVD mapRow(ResultSet rs, int index) throws SQLException {
            DVD td = new DVD();
            td.setDVDId(rs.getInt("dvdId"));
            td.setTitle(rs.getString("title"));
            td.setReleaseYear(rs.getInt("releaseYear"));
            td.setDirector(rs.getString("director"));
            td.setRating(rs.getString("rating"));
            td.setNotes(rs.getString("notes"));
            return td;
        }
    }



}

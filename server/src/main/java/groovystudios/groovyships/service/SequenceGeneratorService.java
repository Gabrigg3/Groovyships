package groovystudios.groovyships.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class SequenceGeneratorService {

    @Autowired
    private MongoOperations mongoOperations;

    public long getNextSequenceId(String key) {

        Query query = new Query(Criteria.where("_id").is(key));
        Update update = new Update().inc("seq", 1);

        FindAndModifyOptions options = new FindAndModifyOptions()
                .returnNew(true)
                .upsert(true);

        var counter = mongoOperations.findAndModify(
                query,
                update,
                options,
                Counter.class
        );

        return counter.getSeq();
    }

    public static class Counter {
        private String id;
        private long seq;

        public long getSeq() { return seq; }
        public void setSeq(long seq) { this.seq = seq; }
    }
}
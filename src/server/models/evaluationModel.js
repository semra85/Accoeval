const redisClient = require('../redisClient.js');

class Evaluations {
  constructor() {
  }

  getEvaluations() {
    return redisClient.lrangeAsync('evaluations', 0, -1).then((evaluations) => {
      var obj = JSON.parse('[' + evaluations + ']');

      return new Promise((resolve) => {
        resolve(obj);
      })
    });
  }

  getEvaluationsById(id) {
    return this.getEvaluations().then((evaluations) => {
      var filtered = evaluations.filter((elem) => {
        return elem.id === parseInt(id, 10);
      })  

      return new Promise((resolve) => {
        resolve(filtered);
      });
    });
  }

  getEvaluationsByWriter(writerId) {
   return this.getEvaluations().then((evaluations) => {
      var filtered = evaluations.filter((elem) => {
        return elem.writer === parseInt(writerId, 10);
      })

      return new Promise((resolve) => {
        resolve(filtered);
      });
    });
  }

  getEvaluationsByAccommodation(accommodationId) {
    return this.getEvaluations().then((evaluations) => {
      var filtered = evaluations.filter((elem) => {
        return elem.accommodation === parseInt(accommodationId, 10);
      })

      return new Promise((resolve) => {
        resolve(filtered);
      });
    });
  }

  addEvaluation(evaluation) {
    return redisClient.incrAsync('evaluationIds').then((id) => {
      var evalObj = {
        id: parseInt(id),
        writer: evaluation.writer,
        accommodation: evaluation.accommodation,
        text: evaluation.text,
        rating: evaluation.rating
      };

      return redisClient.rpushAsync('evaluations', JSON.stringify(evalObj)).then(() => {
        return new Promise((resolve) => {
          resolve(evalObj);
        })
      });
    });
  }

  updateEvaluation(id, evaluation) {
    return redisClient.lsetAsync('evaluations', parseInt(id), JSON.stringify({
      id: parseInt(id, 10),
      writer: parseInt(evaluation.writer, 10),
      accommodation: evaluation.accommodation,
      text: evaluation.text,
      rating: evaluation.rating
    }));
  }

  deleteEvaluation(id) {
   return this.updateEvaluation(id, { writer: -1, accommodation: -1, text: 'deleted', rating: 1 })
  }
}

module.exports = Evaluations;

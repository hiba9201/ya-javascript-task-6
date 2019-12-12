'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = true;

/**
 * Функция паралелльно запускает указанное число промисов
 *
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    if (jobs.length === 0) {
        return Promise.resolve(jobs);
    }

    const result = new Array(jobs.length);

    const runOnePromise = function (resolve, index) {
        const timeOutPromise = new Promise((timeOutResolve) =>
            setTimeout(() => timeOutResolve(new Error('Promise timeout')), timeout)
        );
        Promise.race([jobs[index](), timeOutPromise])
            .then(res => {
                result[index] = res;
            }, res => {
                result[index] = res;
            })
            .finally(() => {
                if (index < jobs.length - 1) {
                    runOnePromise(resolve, ++index);
                }
                if (!hasEmptySlot(result)) {
                    resolve(result);
                }
            });
    };

    return new Promise((resolve) => {
        for (let i = 0; i < parallelNum; i++) {
            runOnePromise(resolve, i);
        }
    });
}

function hasEmptySlot(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr)) {
            return true;
        }
    }

    return false;
}

module.exports = {
    runParallel,
    isStar
};

package com.mymedicine.myson_backend.scheduler;

import com.mymedicine.myson_backend.service.ApiBatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 공공데이터 API 자동 적재 스케줄러
 * 매일 지정된 시간에 외부 API를 호출하여 DB 데이터를 갱신합니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BatchScheduler {

    private final ApiBatchService apiBatchService;

    /**
     * 공공데이터 통합 배치 작업 실행
     * 실행 주기: 매일 새벽 04:00 (KST)
     */
    @Scheduled(cron = "0 0 4 * * *", zone = "Asia/Seoul")
    public void runPublicDataBatchJob() {
        log.info("========== [Batch] 공공데이터 자동 적재 작업을 시작합니다 ==========");

        try {
            // 1. 낱알 식별 정보 적재
            log.info("[Batch] 1. 낱알 식별 정보 적재 시작");
            executeBatchTask(this::processPublicDataLoad);

            // 2. 의약품 회수 정보 적재
            log.info("[Batch] 2. 의약품 회수 정보 적재 시작");
            executeBatchTask(this::processRecallDataLoad);

            log.info("========== [Batch] 모든 자동 적재 작업 완료 ==========");

        } catch (Exception e) {
            log.error("[Batch] 심각한 오류 발생 - 배치 작업이 중단되었습니다.", e);
        }
    }

    /**
     * 낱알 식별 정보 적재 로직
     */
    private void processPublicDataLoad() throws Exception {
        int pageNo = 1;
        int totalLoadedCount = 0;

        // 데이터가 없을 때까지 반복 (페이지네이션)
        while (true) {
            log.info("[Batch-Public] {}페이지 적재 시도...", pageNo);
            int loadedCount = apiBatchService.loadAndStorePublicData(pageNo);

            if (loadedCount == 0) {
                log.info("[Batch-Public] 적재 완료. 총 건수: {}", totalLoadedCount);
                break;
            }

            totalLoadedCount += loadedCount;
            pageNo++;

            // 외부 API 호출 제한(Rate Limit) 및 서버 부하 방지를 위해 대기
            Thread.sleep(3000);
        }
    }

    /**
     * 회수/판매중지 정보 적재 로직
     */
    private void processRecallDataLoad() throws Exception {
        int pageNo = 1;
        int totalLoadedCount = 0;

        while (true) {
            log.info("[Batch-Recall] {}페이지 적재 시도...", pageNo);
            int loadedCount = apiBatchService.loadAndStoreRecallData(pageNo);

            if (loadedCount == 0) {
                log.info("[Batch-Recall] 적재 완료. 총 건수: {}", totalLoadedCount);
                break;
            }

            totalLoadedCount += loadedCount;
            pageNo++;
            Thread.sleep(3000); // Rate Limit 고려
        }
    }

    /**
     * 배치 작업 래퍼 (예외 처리 일원화)
     */
    private void executeBatchTask(BatchTask task) throws Exception {
        try {
            task.run();
        } catch (Exception e) {
            log.error("[Batch] 작업 실행 중 오류 발생: {}", e.getMessage());
            throw e; // 상위 메서드에서 전체 흐름을 제어하도록 예외 전파
        }
    }

    /**
     * 배치 작업 실행을 위한 함수형 인터페이스
     */
    @FunctionalInterface
    interface BatchTask {
        void run() throws Exception;
    }
}
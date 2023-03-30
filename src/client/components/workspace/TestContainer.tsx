import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ScheduleReqResContainer from '../legacy-components/ScheduleReqResContainer';
import StoppedContainer from '../legacy-components/StoppedContainer';
import ReqResContainer from '../legacy-components/ReqResContainer';
import { simpleLoadTest, LoadTestResult } from '../main/loadTest/LoadTest';
import LoadTestController from '../../controllers/LoadTestController';
import { connect } from 'react-redux';
import { reqResUpdated, reqResItemAdded } from '../../toolkit-refactor/reqRes/reqResSlice';
import { RootState, AppDispatch } from '../../toolkit-refactor/store';
import { ReqRes } from '../../../types';

/**
 * TestContainer component allows users to configure and perform load tests.
 * It contains inputs for the load test frequency and duration, as well as buttons
 * to start and stop the tests. The component also renders the ReqResContainer,
 * ScheduleReqResContainer, and StoppedContainer components to display the results
 * of the tests.
 */

const mapStateToProps = (store: RootState) => ({
  reqResArray: store.reqRes.reqResArray,
  currentResponse: store.reqRes.currentResponse,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  reqResItemAdded: (reqRes: ReqRes) => {
    dispatch(reqResItemAdded(reqRes));
  },
  reqResUpdated: (reqRes: ReqRes) => {
    dispatch(reqResUpdated(reqRes));
  },
});

interface TestContainerProps {
  reqResArray: ReqRes[];
  reqResItemAdded: (reqRes: ReqRes) => void;
  reqResUpdated: (reqRes: ReqRes) => void;
}

const TestContainer: React.FC<TestContainerProps> = ({ reqResArray, currentResponse, reqResItemAdded, reqResUpdated }) => {
  const [scheduleInterval, setScheduleInterval] = useState<number>(1);
  const [runScheduledTests, setScheduledTests] = useState<boolean>(false);
  const [callsPerSecond, setCallsPerSecond] = useState<number>(1);
  const [totalTime, setTotalTime] = useState<number>(10);
  const isDark = useSelector((state: any) => state.ui.isDark);

  const reqResObj = currentResponse;

  return (
    <div>
      <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center mt-2">
        <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
          <p>Frequency:</p>
          <input
            className={`${
              isDark ? 'is-dark-200' : ''
            } ml-1 input input-is-medium is-info`}
            style={{ width: '65px' }}
            type="number"
            placeholder="Calls/sec"
            value={callsPerSecond}
            onChange={(e) => {
              setCallsPerSecond(e.target.value);
            }}
          />
        </div>
        <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
          <p>Duration:</p>
          <input
            className={`${
              isDark ? 'is-dark-200' : ''
            } ml-1 input input-is-medium is-info`}
            style={{ width: '65px' }}
            type="number"
            placeholder="Duration"
            value={totalTime}
            onChange={(e) => {
              setTotalTime(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center mt-2">
        <div className="ml-2">
          <button
            className={`button is-small is-primary ${
              isDark ? '' : 'is-outlined'
            } button-padding-vertical button-hover-color ml-3`}
            onClick={async () => {
              const results = await simpleLoadTest(
                reqResObj.url,
                callsPerSecond,
                totalTime
              );

              // Assuming you have a valid reqResObj
              LoadTestController.processLoadTestResults(reqResObj.id, results);
            }}
          >
            Run
          </button>
          <button
            className={`button is-small is-danger ${
              isDark ? '' : 'is-outlined'
            } button-padding-vertical button-hover-color ml-3`}
            onClick={() => {
              setScheduledTests(false);
            }}
          >
            Stop
          </button>
        </div>
      </div>
      <div className="m-1">
        <ReqResContainer displaySchedule={false} />
      </div>
      {runScheduledTests && (
        <ScheduleReqResContainer scheduleInterval={scheduleInterval} />
      )}
      {!runScheduledTests && <StoppedContainer />}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TestContainer);

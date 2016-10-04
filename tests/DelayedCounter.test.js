import test from 'tape'
import DelayedCounter from '../src/components/DelayedCounter'

test('INCREMENTED event', assert => {
  assert.plan(1)
  const counter = new DelayedCounter()
  const state = counter.update(0, 'INCREMENTED')
  assert.equal(state.model, 1, 'should increment the model')
})

test('INCREMENT_REQUESTED event', assert => {
  assert.plan(2)
  const counter = new DelayedCounter()
  const state = counter.update(0, 'INCREMENT_REQUESTED')
  assert.equal(state.model, 0, 'should not increment the model')
  assert.equal(state.cmd, 'SCHEDULE_INCREMENT', 'should return the correct side effect command')
})

test('SCHEDULE_INCREMENT side effect', { timeout: 2000 }, assert => {
  assert.plan(2)
  const counter = new DelayedCounter()
  const subscriptionsStream = counter.subscriptions('SCHEDULE_INCREMENT')
  assert.ok(subscriptionsStream)
  subscriptionsStream
    .subscribe(event => assert.equal(event, 'INCREMENTED', 'should return an INCREMENTED event'))
})

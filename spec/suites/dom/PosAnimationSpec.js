describe('PosAnimation', function () {
	var el;

	beforeEach(function () {
		el = document.createElement('div');
		this.subject = new L.PosAnimation();
		this.subject._el = el;
	});

	describe('#_onStep', function () {
		it("sets element position and fires step event if it is able to get current position", function () {
			var point = new L.Point(5, 5, true);
			sinon.stub(this.subject, '_getPos').returns(point);
			this.subject.fire = sinon.stub();
			this.subject._onStep();
			expect(this.subject.fire.withArgs('step').calledOnce).to.be(true);
			expect(L.DomUtil.getPosition(this.subject._el)).to.be(point);
		});

		it('stops transition if a position returned', function () {
			sinon.stub(this.subject, '_onTransitionEnd');
			sinon.stub(this.subject, '_getPos').returns(undefined);
			this.subject._onStep();
			expect(this.subject._onTransitionEnd.calledOnce).to.be(true);
		});
	});
});

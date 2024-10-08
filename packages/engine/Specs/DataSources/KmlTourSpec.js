import {
  Cartesian3,
  HeadingPitchRange,
  KmlLookAt,
  KmlTour,
  KmlTourFlyTo,
  KmlTourWait,
  Math as CesiumMath,
} from "../../index.js";

import pollToPromise from "../../../../Specs/pollToPromise.js";

describe("DataSources/KmlTour", function () {
  function getLookAt() {
    const position = Cartesian3.fromDegrees(40.0, 30.0, 1000);
    const hpr = new HeadingPitchRange(
      CesiumMath.toRadians(10.0),
      CesiumMath.toRadians(45.0),
      10000,
    );
    return new KmlLookAt(position, hpr);
  }

  function createMockWidget() {
    const mockWidget = {};
    mockWidget.scene = {};
    mockWidget.scene.camera = {};
    mockWidget.scene.camera.flyTo = jasmine
      .createSpy("flyTo")
      .and.callFake(function (options) {
        if (options.complete) {
          options.complete();
        }
      });
    mockWidget.scene.camera.flyToBoundingSphere = jasmine
      .createSpy("flyToBoundingSphere")
      .and.callFake(function (boundingSphere, options) {
        if (options.complete) {
          options.complete();
        }
      });
    return mockWidget;
  }

  it("add entries to playlist", function () {
    const tour = new KmlTour("test", "test");
    const wait = new KmlTourWait(10);
    const flyTo = new KmlTourFlyTo(5, null, getLookAt());
    tour.addPlaylistEntry(wait);
    tour.addPlaylistEntry(flyTo);

    expect(tour.playlist.length).toEqual(2);
    expect(tour.playlist[0]).toBe(wait);
    expect(tour.playlist[1]).toBe(flyTo);
  });

  it("calls entries play", function () {
    const waitSpy = spyOn(KmlTourWait.prototype, "play").and.callFake(
      function (callback) {
        callback();
      },
    );
    const flySpy = spyOn(KmlTourFlyTo.prototype, "play").and.callFake(
      function (callback) {
        callback();
      },
    );

    const tour = new KmlTour("test", "test");
    const wait = new KmlTourWait(0.1);
    const flyTo = new KmlTourFlyTo(0.1, null, getLookAt());
    tour.addPlaylistEntry(wait);
    tour.addPlaylistEntry(flyTo);

    const mockWidget = createMockWidget();
    tour.play(mockWidget);
    return pollToPromise(function () {
      return waitSpy.calls.count() > 0 && flySpy.calls.count() > 0;
    }).then(function () {
      expect(waitSpy).toHaveBeenCalled();
      expect(flySpy).toHaveBeenCalled();
    });
  });

  it("calls events", function () {
    const tour = new KmlTour("test", "test");
    const wait1 = new KmlTourWait(0.05);
    const wait2 = new KmlTourWait(0.02);

    const tourStart = jasmine.createSpy("TourStart");
    const tourEnd = jasmine.createSpy("TourEnd");
    const entryStart = jasmine.createSpy("EntryStart");
    const entryEnd = jasmine.createSpy("EntryEnd");

    tour.addPlaylistEntry(wait1);
    tour.addPlaylistEntry(wait2);

    tour.tourStart.addEventListener(tourStart);
    tour.tourEnd.addEventListener(tourEnd);
    tour.entryStart.addEventListener(entryStart);
    tour.entryEnd.addEventListener(entryEnd);

    tour.play(createMockWidget());
    return pollToPromise(function () {
      return tourEnd.calls.count() > 0;
    }).then(function () {
      expect(tourStart).toHaveBeenCalled();
      expect(entryStart).toHaveBeenCalled();
      expect(entryEnd).toHaveBeenCalled();
      expect(tourEnd).toHaveBeenCalledWith(false);
    });
  });

  it("terminates playback", function () {
    const tour = new KmlTour("test", "test");
    const wait = new KmlTourWait(60);
    const flyTo = new KmlTourFlyTo(0.1, null, getLookAt());

    const tourStart = jasmine.createSpy("TourStart");
    const tourEnd = jasmine.createSpy("TourEnd");
    const entryStart = jasmine.createSpy("EntryStart");
    const entryEnd = jasmine.createSpy("EntryEnd");

    tour.addPlaylistEntry(wait);
    tour.addPlaylistEntry(flyTo);

    tour.tourStart.addEventListener(tourStart);
    tour.tourEnd.addEventListener(tourEnd);
    tour.entryStart.addEventListener(entryStart);
    tour.entryEnd.addEventListener(entryEnd);

    const mockWidget = createMockWidget();
    tour.play(mockWidget);
    setTimeout(function () {
      tour.stop();
      expect(tourStart).toHaveBeenCalled();
      // Wait entry have been started
      expect(entryStart).toHaveBeenCalledWith(wait);
      // Wait entry have been terminated
      expect(entryEnd).toHaveBeenCalledWith(wait, true);
      expect(tourEnd).toHaveBeenCalledWith(true);

      expect(entryStart.calls.count()).toEqual(1);
      expect(entryEnd.calls.count()).toEqual(1);
      expect(tourStart.calls.count()).toEqual(1);
      expect(tourEnd.calls.count()).toEqual(1);

      expect(mockWidget.scene.camera.flyTo.calls.count()).toEqual(0);
      expect(mockWidget.scene.camera.flyToBoundingSphere.calls.count()).toEqual(
        0,
      );
    }, 5);
  });
});

goog.provide('plugin.cookbook_tracks.TracksPlugin');

goog.require('ol.Feature');
goog.require('ol.geom.Point');
goog.require('os.plugin.AbstractPlugin');
goog.require('os.plugin.PluginManager');
goog.require('os.time.TimeInstant');
goog.require('plugin.places.PlacesPlugin');
goog.require('plugin.track');

plugin.cookbook_tracks.lat = -35.0;
plugin.cookbook_tracks.lon = 135.0;
plugin.cookbook_tracks.latDelta = 0.1;
plugin.cookbook_tracks.lonDelta = 0.1;

var transformToMap;

/**
 * Provides a plugin cookbook example for track creation and update.
 *
 * @extends {os.plugin.AbstractPlugin}
 * @constructor
 */
plugin.cookbook_tracks.TracksPlugin = function() {
  plugin.cookbook_tracks.TracksPlugin.base(this, 'constructor');
  this.id = plugin.cookbook_tracks.ID;
  this.errorMessage = null;
};
goog.inherits(plugin.cookbook_tracks.TracksPlugin, os.plugin.AbstractPlugin);

/**
 * @type {string}
 * @const
 */
plugin.cookbook_tracks.ID = 'cookbook_tracks';

/**
 * @inheritDoc
 */
plugin.cookbook_tracks.TracksPlugin.prototype.init = function() {
  transformToMap = ol.proj.getTransform(os.proj.EPSG4326, os.map.PROJECTION);
  var pp = plugin.places.PlacesPlugin.getInstance();
  os.ui.pluginManager.addPlugin(pp);
  var track = plugin.track.createAndAdd(/** @type {!plugin.track.CreateOptions} */ ({
    // coordinates: plugin.cookbook_tracks.getCoordinates_(),
    features: plugin.cookbook_tracks.getFeatures_(),
    name: 'Cookbook track',
    color: '#00ff00'
  }));
  setInterval(function() {
    plugin.cookbook_tracks.updateTrack(/** @type {!ol.Feature} */ (track));
  }, 2000);
};

/**
 * @private
 * @return {!Array<!Array<number>>} coordinates array for current location
 */
plugin.cookbook_tracks.getCoordinates_ = function() {
  var coordinate = transformToMap([plugin.cookbook_tracks.lon, plugin.cookbook_tracks.lat]);
  coordinate.push(0);
  coordinate.push(Date.now());
  var coordinates = [coordinate];
  return coordinates;
};

/**
 * @private
 * @return {!Array<!ol.Feature>} features array for current location
 */
plugin.cookbook_tracks.getFeatures_ = function() {
  var coordinate = transformToMap([plugin.cookbook_tracks.lon, plugin.cookbook_tracks.lat]);
  coordinate.push(0);
  var point = new ol.geom.Point(coordinate);
  var feature = new ol.Feature(point);
  feature.set(os.data.RecordField.TIME, new os.time.TimeInstant(Date.now()));
  var features = [feature];
  return features;
};

/**
 * @private
 * @param {!ol.Feature} track the track to update
 */
plugin.cookbook_tracks.updateTrack = function(track) {
  plugin.cookbook_tracks.modifyPosition_();
  plugin.track.addToTrack({
    // coordinates: plugin.cookbook_tracks.getCoordinates_(),
    features: plugin.cookbook_tracks.getFeatures_(),
    track: track
  });
};

/**
 * @private
 */
plugin.cookbook_tracks.modifyPosition_ = function() {
  plugin.cookbook_tracks.lat += plugin.cookbook_tracks.latDelta;
  plugin.cookbook_tracks.lon += plugin.cookbook_tracks.lonDelta;
  if (plugin.cookbook_tracks.lat > 50.0) {
    plugin.cookbook_tracks.latDelta = -0.05;
  }
  if (plugin.cookbook_tracks.lat < -50.0) {
    plugin.cookbook_tracks.latDelta = 0.05;
  }
  if (plugin.cookbook_tracks.lon >= 160.0) {
    plugin.cookbook_tracks.lonDelta = -0.05;
  }
  if (plugin.cookbook_tracks.lon < 0.0) {
    plugin.cookbook_tracks.lonDelta = 0.05;
  }
};

// add the plugin to the application
os.plugin.PluginManager.getInstance().addPlugin(new plugin.cookbook_tracks.TracksPlugin());



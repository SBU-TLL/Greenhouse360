function getData(gid) {
  console.log("aa")
  var promise = jQuery.Deferred();
  var pre="d/e/";
  //var id = "2PACX-1vTRYTjMo8H60rQLH5qRaunUdAfDumZe6xdynEL-9EzrDcIMyArxPeWzI15l6GvUHv08Mfw5OKNq0kpS";
  var id = "2PACX-1vTT_46okLvn_qmzAiEN5NET-2GdNx9v6lcN5O7UBMfG1b1mD6IFYRV-q9b6L7uzmz-ZKQ_dqVL_Xn7q";
  //var gid = "0";




  $.get(`https://apps.tlt.stonybrook.edu/gproxy/?id=${id}&gid=${gid}&prePath=${pre}`, function(data) {
 var gdata = $.csv.toObjects(data);
  
    promise.resolve(gdata)
  });

  return promise.promise()
}

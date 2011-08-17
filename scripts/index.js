function getState()
{
  log('getState');
  $.getJSON('/getState', gotState);
}

function gotState(result)
{
  log('gotState');
  log(result);

  if(result==null)
  {
    $('#update').show('slow');
    $('#flares').hide('slow');
  }
  else
  {
    log('hiding update');
    $('#update').hide('slow');
    $('#flareStatus').text(result.status);
    $('#flareTime').text(result.time);

    $('#flares').show('slow');
  }
}

function update()
{
  var status=$('#updateField').val();
  var time=$('#updateTime').val();
  log('status: '+status);
  log('time: '+time);

  var state={'status': status, 'time': time};
  $.post('/setState', JSON.stringify(state));

  getState(state);

  return false;
}

function extinguish()
{
  $.post('/setState', JSON.stringify(null));

  getState(null);

  return false;
}

function initIndex()
{
  $("#tabs").tabs({'cache': true});
  $("#tabs").show();
  $("#people").show();

  $('#updateButton').click(update);
  $('#extinguishButton').click(extinguish);
}

$(document).ready(initIndex);

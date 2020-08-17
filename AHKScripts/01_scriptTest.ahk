if getkeystate("capslock","t")
  {
    MyVar = B
  }
else
  {
    MyVar = b
  }

+a:: Send {%MyVar%}

return

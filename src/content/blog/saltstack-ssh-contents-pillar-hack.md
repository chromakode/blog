---
title: A hacky workaround for empty contents_pillar in salt-ssh
pubDate: July 9, 2014
---

# A hacky workaround for empty `contents_pillar` in `salt-ssh`

I've been really enjoying learning to use [SaltStack](http://docs.saltstack.com/en/latest/) to configure my servers and VMs. The relatively new `salt-ssh` transport is incredibly convenient for managing a small number of project cloud servers. However, there is one limitation I've discovered when handling certificates and private keys: `file.managed`'s `contents_pillar` parameter outputs blank files.

It seems that pillar data is not sent to the minion environment when using `salt-ssh`. The `contents_pillar` pillar lookup then falls back to an empty default value (site note: a good example of why strict KeyErrors are helpful!). However, since the state datastructure is rendered on the master server, there is a hacky workaround relying on templating directives. For example:

    /etc/openvpn/server.key:
      file.managed:
        - contents: |
            {{ pillar['openvpn']['server_key'] | indent(8) }}
        - user: root
        - group: root
        - mode: 600

(It is necessary to use the `indent()` jinja2 filter so that the inlined contents form valid YAML.)

Hopefully a future version of `salt-ssh` will support `contents_pillar`, making this unnecessary. In the mean time, this was the least gross hack I could find.

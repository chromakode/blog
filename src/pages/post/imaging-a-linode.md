---
layout: ../../layouts/PostLayout.astro
title: Downloading an image of a Linode drive
pubDate: July 9, 2014
---

# Downloading an image of a Linode drive

Recently, before rebuilding [samurai](http://samurai.chromakode.com), I wanted to download the old drive image as a final resort in case I'd forgotten to snag any files. I was a bit disappointed that there was no way to simply download the raw image using the web interface, but there are dark arts of `dd` that can fill this gap. Linode provides [their own instructions][1] for the procedure, but I discovered a few tricks worth saving:

[1]: https://library.linode.com/migration/ssh-copy

1.  Running a separate rescue distro per Linode's suggestion and then opening it up to root ssh seemed a bit ugly to me. However, imaging the system live and in-place could lead to corrupt images if the disk is written to. Remounting the live root filesystem read-only with `mount` was not possible, but there is an old Linux [SysRq](https://www.kernel.org/doc/Documentation/sysrq.txt) trick you can use to remount all mounted filesystems read-only:

    ```sh
    $ echo u > /proc/sysrq-trigger
    ```

    While it's still a good idea to stop any nonessential services, this allowed me to proceed with the system online and using my existing ssh keys. I also lived dangerously and kept my soon-to-be-doomed `nginx` process running during the imaging. >:)

2.  Since most of my drive was empty zeroes, passing the data through `gzip` was a massive savings in both transfer and disk usage at the destination:

    ```sh
    $ ssh samurai "dd if=/dev/xvda bs=64k | gzip -c" | dd of=./samurai.img.gz
    ```

3.  Un-gzipping the image file the straightforward way leads to a problem: `gunzip` does not appear to support [sparse files](http://en.wikipedia.org/wiki/Sparse_file). In my case, I didn't have 50GB to spare for 1.5GB of uncompressed image data, so I needed a way to decompress to a sparse file. There's a [nice trick](http://unix.stackexchange.com/a/50481) using `cp` and `/proc`'s file descriptor mapping to pull this off:

    ```sh
    $ gunzip -ck ./samurai.img.gz | cp --sparse=always /proc/self/fd/0 samurai.img
    ```

So there you have it! Gzipped online disk imaging with a sparse output file. Note that the image itself won't be bootable, as Linodes boot a kernel specified outside of their drive storage. You can read the data by mounting the image loopback via the [instructions Linode provides](https://library.linode.com/migration/ssh-copy#sph_verifying-the-disk-image).

I'm sure this is all common knowledge around sysadmin circles, but I wasn't able to find all of the pieces in one place during my googling. Hopefully this recipe may prove useful. :)
